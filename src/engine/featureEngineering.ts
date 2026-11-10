import { Account, Transaction, AccountFeatures } from '../types';
import { DirectedGraph } from './graphBuilder';
import { CycleResult } from './cycleDetection';
import { CommunityResult } from './communityDetection';

export function computeAccountFeatures(
  accounts: Account[],
  transactions: Transaction[],
  graph: DirectedGraph,
  cycles: CycleResult,
  communities: CommunityResult
): Map<string, AccountFeatures> {
  const featureMap = new Map<string, AccountFeatures>();

  // 1. Group transactions by account
  const incomingTxns = new Map<string, Transaction[]>();
  const outgoingTxns = new Map<string, Transaction[]>();

  accounts.forEach(acc => {
    incomingTxns.set(acc.account_id, []);
    outgoingTxns.set(acc.account_id, []);
  });

  transactions.forEach(t => {
    if (incomingTxns.has(t.to_account)) {
      incomingTxns.get(t.to_account)!.push(t);
    }
    if (outgoingTxns.has(t.from_account)) {
      outgoingTxns.get(t.from_account)!.push(t);
    }
  });

  // 2. Pre-calculate shared device and IP clusters
  const deviceCounts = new Map<string, number>();
  const ipCounts = new Map<string, number>();

  accounts.forEach(acc => {
    deviceCounts.set(acc.device_id, (deviceCounts.get(acc.device_id) || 0) + 1);
    ipCounts.set(acc.ip_cluster, (ipCounts.get(acc.ip_cluster) || 0) + 1);
  });

  // 3. Compute features per account
  accounts.forEach(acc => {
    const accId = acc.account_id;
    const inTx = incomingTxns.get(accId) || [];
    const outTx = outgoingTxns.get(accId) || [];

    const inSenders = new Set(inTx.map(t => t.from_account));
    const outReceivers = new Set(outTx.map(t => t.to_account));

    const total_incoming = inTx.reduce((sum, t) => sum + t.amount, 0);
    const total_outgoing = outTx.reduce((sum, t) => sum + t.amount, 0);

    // Pass-through ratio: mules typically pass through 90% - 100% of money received
    let pass_through_ratio = 0;
    if (total_incoming > 0) {
      pass_through_ratio = Math.min(1.5, Number((total_outgoing / total_incoming).toFixed(3)));
    }

    // Temporal analysis: Dwell time between credit and subsequent debit
    const allTxSorted = [...inTx.map(t => ({ ...t, isCredit: true })), ...outTx.map(t => ({ ...t, isCredit: false }))]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let totalDwellMinutes = 0;
    let dwellCount = 0;
    let minDwell = 999999;
    let rapidTransfersCount = 0;

    for (let i = 0; i < allTxSorted.length - 1; i++) {
      const current = allTxSorted[i];
      const next = allTxSorted[i + 1];
      const timeDiffMinutes = Math.max(0, (new Date(next.timestamp).getTime() - new Date(current.timestamp).getTime()) / 60000);

      if (timeDiffMinutes <= 15) {
        rapidTransfersCount++;
      }

      if (current.isCredit && !next.isCredit) {
        totalDwellMinutes += timeDiffMinutes;
        dwellCount++;
        if (timeDiffMinutes < minDwell) {
          minDwell = timeDiffMinutes;
        }
      }
    }

    const avg_dwell_time_minutes = dwellCount > 0 ? Math.round(totalDwellMinutes / dwellCount) : 1440;
    const min_dwell_time_minutes = minDwell === 999999 ? 1440 : Math.round(minDwell);

    // Velocity burst: max transactions in any 1-hour window
    let maxBurst = 0;
    for (let i = 0; i < allTxSorted.length; i++) {
      const startT = new Date(allTxSorted[i].timestamp).getTime();
      let burstCount = 1;
      for (let j = i + 1; j < allTxSorted.length; j++) {
        const nextT = new Date(allTxSorted[j].timestamp).getTime();
        if (nextT - startT <= 3600000) {
          burstCount++;
        } else {
          break;
        }
      }
      if (burstCount > maxBurst) maxBurst = burstCount;
    }

    // Round amount and structuring ratio
    const totalTxns = inTx.length + outTx.length;
    let roundCount = 0;
    let structuringCount = 0;
    let nightCount = 0;

    allTxSorted.forEach(t => {
      // Round amounts: e.g. 50,000, 20,000, 10,000, 5,000
      if (t.amount >= 5000 && t.amount % 5000 === 0) {
        roundCount++;
      }
      // Structuring: just below 50,000 or 10,000
      if ((t.amount >= 48000 && t.amount < 50000) || (t.amount >= 9500 && t.amount < 10000)) {
        structuringCount++;
      }
      // Night ratio: 11 PM to 5 AM UTC
      const hour = new Date(t.timestamp).getUTCHours();
      if (hour >= 23 || hour <= 5) {
        nightCount++;
      }
    });

    const round_amount_ratio = totalTxns > 0 ? Number((roundCount / totalTxns).toFixed(3)) : 0;
    const structuring_ratio = totalTxns > 0 ? Number((structuringCount / totalTxns).toFixed(3)) : 0;
    const night_ratio = totalTxns > 0 ? Number((nightCount / totalTxns).toFixed(3)) : 0;

    // Income mismatch: compare total inflow with declared monthly income
    const declared = acc.declared_monthly_income || 25000;
    const income_mismatch_ratio = Number((total_incoming / declared).toFixed(2));

    // Age volume ratio: total incoming / account age days
    const ageDays = Math.max(1, acc.account_age_days);
    const age_volume_ratio = Number(((total_incoming + total_outgoing) / ageDays).toFixed(2));

    // Graph features
    const in_degree = graph.adjacencyIn.get(accId)?.size || 0;
    const out_degree = graph.adjacencyOut.get(accId)?.size || 0;
    const cycle_membership = cycles.cycleNodes.has(accId) ? 1 : 0;
    const community_size = communities.componentSizes.get(accId) || 1;

    // Centrality approximation: normalized degree centrality
    const totalGraphNodes = Math.max(1, accounts.length);
    const centrality_score = Number(((in_degree + out_degree) / totalGraphNodes).toFixed(4));

    // Suspicious neighbors count: check neighbors with high burst or plant labels
    let suspiciousNeighbors = 0;
    const neighbors = new Set<string>();
    graph.adjacencyIn.get(accId)?.forEach(n => neighbors.add(n));
    graph.adjacencyOut.get(accId)?.forEach(n => neighbors.add(n));

    neighbors.forEach(nId => {
      const neighborAcc = graph.nodes.get(nId);
      if (neighborAcc && neighborAcc.fraud_ring_id) {
        suspiciousNeighbors++;
      }
    });

    // Money movement depth (shortest hop count from a root inflow node)
    const money_movement_depth = in_degree > 0 && out_degree > 0 ? 2 : in_degree > 0 ? 1 : 0;

    featureMap.set(accId, {
      account_id: accId,
      in_degree,
      out_degree,
      unique_senders: inSenders.size,
      unique_receivers: outReceivers.size,
      total_incoming,
      total_outgoing,
      pass_through_ratio,
      avg_dwell_time_minutes,
      min_dwell_time_minutes,
      account_age_days: ageDays,
      age_volume_ratio,
      income_mismatch_ratio,
      round_amount_ratio,
      structuring_ratio,
      night_ratio,
      burst_velocity: maxBurst,
      shared_device_count: Math.max(0, (deviceCounts.get(acc.device_id) || 1) - 1),
      shared_ip_count: Math.max(0, (ipCounts.get(acc.ip_cluster) || 1) - 1),
      cycle_membership,
      centrality_score,
      connected_component_size: community_size,
      suspicious_neighbors_count: suspiciousNeighbors,
      money_movement_depth,
      rapid_transfers_count: rapidTransfersCount
    });
  });

  return featureMap;
}
