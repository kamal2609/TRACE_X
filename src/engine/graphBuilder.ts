import { Account, Transaction } from '../types';

export interface GraphEdge {
  from: string;
  to: string;
  totalAmount: number;
  transactionCount: number;
  transactions: Transaction[];
  channels: Set<string>;
  earliestTxn: string;
  latestTxn: string;
}

export interface DirectedGraph {
  nodes: Map<string, Account>;
  edges: Map<string, GraphEdge>; // key: `${from}->${to}`
  adjacencyOut: Map<string, Set<string>>;
  adjacencyIn: Map<string, Set<string>>;
}

export function buildDirectedGraph(accounts: Account[], transactions: Transaction[]): DirectedGraph {
  const nodes = new Map<string, Account>();
  const edges = new Map<string, GraphEdge>();
  const adjacencyOut = new Map<string, Set<string>>();
  const adjacencyIn = new Map<string, Set<string>>();

  // Register nodes
  accounts.forEach(acc => {
    nodes.set(acc.account_id, acc);
    adjacencyOut.set(acc.account_id, new Set<string>());
    adjacencyIn.set(acc.account_id, new Set<string>());
  });

  // Aggregate edges
  transactions.forEach(txn => {
    if (!txn.from_account || !txn.to_account || txn.from_account === txn.to_account) return;

    // Ensure nodes exist in adjacency maps even if external/cashout
    if (!adjacencyOut.has(txn.from_account)) adjacencyOut.set(txn.from_account, new Set<string>());
    if (!adjacencyOut.has(txn.to_account)) adjacencyOut.set(txn.to_account, new Set<string>());
    if (!adjacencyIn.has(txn.from_account)) adjacencyIn.set(txn.from_account, new Set<string>());
    if (!adjacencyIn.has(txn.to_account)) adjacencyIn.set(txn.to_account, new Set<string>());

    adjacencyOut.get(txn.from_account)!.add(txn.to_account);
    adjacencyIn.get(txn.to_account)!.add(txn.from_account);

    const edgeKey = `${txn.from_account}->${txn.to_account}`;
    const existing = edges.get(edgeKey);

    if (existing) {
      existing.totalAmount += txn.amount;
      existing.transactionCount += 1;
      existing.transactions.push(txn);
      existing.channels.add(txn.channel);
      if (new Date(txn.timestamp).getTime() < new Date(existing.earliestTxn).getTime()) {
        existing.earliestTxn = txn.timestamp;
      }
      if (new Date(txn.timestamp).getTime() > new Date(existing.latestTxn).getTime()) {
        existing.latestTxn = txn.timestamp;
      }
    } else {
      edges.set(edgeKey, {
        from: txn.from_account,
        to: txn.to_account,
        totalAmount: txn.amount,
        transactionCount: 1,
        transactions: [txn],
        channels: new Set([txn.channel]),
        earliestTxn: txn.timestamp,
        latestTxn: txn.timestamp
      });
    }
  });

  return { nodes, edges, adjacencyOut, adjacencyIn };
}
