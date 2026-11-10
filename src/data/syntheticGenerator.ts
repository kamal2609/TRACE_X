import { SeededRandom } from './seededRandom';
import { 
  Account, 
  Transaction, 
  ChannelType, 
  KycLevel, 
  AgeGroup, 
  Region, 
  AccountType, 
  GroundTruthLabel, 
  FraudPatternType 
} from '../types';

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ramesh', 'Suresh', 'Amit', 'Rajesh', 'Pooja', 'Priya', 'Neha', 'Sneha', 'Ananya', 'Sunita',
  'Mohammed', 'Imran', 'Farooq', 'Zaid', 'Venkatesh', 'Deepa', 'Kavita', 'Manish', 'Karan', 'Rohit',
  'Gaurav', 'Vikram', 'Divya', 'Shreya', 'Meera', 'Ritu', 'Naveen', 'Ashok', 'Sanjay', 'Alok'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Kumar', 'Singh', 'Nair', 'Iyer', 'Reddy', 'Rao',
  'Deshmukh', 'Kulkarni', 'Joshi', 'Bose', 'Chatterjee', 'Banerjee', 'Mishra', 'Pandey', 'Yadav', 'Malhotra',
  'Kapoor', 'Khanna', 'Mehta', 'Shah', 'Aggarwal', 'Bhatia', 'Menon', 'Pillai', 'Naidu', 'Chauhan'
];

const BANKS = [
  'HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 
  'Canara Bank', 'IndusInd Bank', 'Union Bank of India'
];

const CITIES = [
  { city: 'Mumbai', region: 'West' as Region },
  { city: 'Delhi', region: 'North' as Region },
  { city: 'Bengaluru', region: 'South' as Region },
  { city: 'Hyderabad', region: 'South' as Region },
  { city: 'Chennai', region: 'South' as Region },
  { city: 'Kolkata', region: 'East' as Region },
  { city: 'Pune', region: 'West' as Region },
  { city: 'Ahmedabad', region: 'West' as Region },
  { city: 'Jaipur', region: 'North' as Region },
  { city: 'Lucknow', region: 'North' as Region },
  { city: 'Surat', region: 'West' as Region },
  { city: 'Kochi', region: 'South' as Region },
  { city: 'Chandigarh', region: 'North' as Region },
  { city: 'Indore', region: 'Central' as Region },
  { city: 'Patna', region: 'East' as Region }
];

export interface SyntheticDataset {
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    seed: number;
    generatedAt: string;
    accountCount: number;
    transactionCount: number;
    muleCount: number;
    ringCount: number;
    totalVolume: number;
  };
}

export function generateSyntheticDataset(seed: number = 42819): SyntheticDataset {
  const rng = new SeededRandom(seed);
  const now = new Date('2026-11-10T10:00:00Z');
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const startTimeMs = now.getTime() - thirtyDaysMs;

  const accounts: Account[] = [];
  const transactions: Transaction[] = [];

  let nextAccountId = 1001;
  let nextTxnId = 500001;

  function createAccountId(): string {
    return `AC-${nextAccountId++}`;
  }

  function createTxnId(): string {
    return `TXN-${nextTxnId++}`;
  }

  // 1. Generate ~350 Normal & False-Positive Accounts
  const totalBaseAccounts = 355;
  for (let i = 0; i < totalBaseAccounts; i++) {
    const firstName = rng.choice(INDIAN_FIRST_NAMES);
    const lastName = rng.choice(INDIAN_LAST_NAMES);
    const holder_name = `${firstName} ${lastName}`;
    const cleanName = holder_name.toLowerCase().replace(/[^a-z]/g, '');
    const bank = rng.choice(BANKS);
    const bankTag = bank.split(' ')[0].toLowerCase();
    const cityInfo = rng.choice(CITIES);
    const account_id = createAccountId();
    const upi_id = `${cleanName}${rng.nextInt(10, 99)}@ok${bankTag}`;

    let account_type: AccountType = 'SAVINGS';
    let declared_income = rng.choice([25000, 35000, 50000, 75000, 120000, 200000]);
    let kyc_level: KycLevel = rng.choice(['FULL', 'FULL', 'FULL', 'MINIMUM', 'SIMPLIFIED']);
    let age_group: AgeGroup = rng.choice(['18-25', '26-35', '36-50', '51+']);
    let ground_truth_label: GroundTruthLabel = 'NORMAL';
    let account_age_days = rng.nextInt(60, 1800);

    // Plant False Positive Lookalikes
    if (i === 10) {
      // Busy retail merchant
      account_type = 'MERCHANT';
      declared_income = 450000;
      kyc_level = 'FULL';
      ground_truth_label = 'MERCHANT_FALSE_POSITIVE';
      account_age_days = 820;
    } else if (i === 11) {
      // Landlord collecting monthly rent
      account_type = 'CURRENT';
      declared_income = 280000;
      kyc_level = 'FULL';
      ground_truth_label = 'NORMAL';
      account_age_days = 1100;
    } else if (i === 12) {
      // Student hostel treasurer
      account_type = 'STUDENT';
      declared_income = 12000;
      age_group = '18-25';
      kyc_level = 'MINIMUM';
      ground_truth_label = 'NORMAL';
      account_age_days = 210;
    } else if (i % 8 === 0) {
      account_type = 'SALARY';
    } else if (i % 12 === 0) {
      account_type = 'CURRENT';
    }

    accounts.push({
      account_id,
      upi_id,
      holder_name,
      bank,
      city: cityInfo.city,
      account_age_days,
      kyc_level,
      device_id: `DEV-${rng.nextInt(10000, 99999)}`,
      ip_cluster: `103.${rng.nextInt(10, 250)}.${rng.nextInt(1, 254)}.*`,
      declared_monthly_income: declared_income,
      age_group,
      region: cityInfo.region,
      account_type,
      ground_truth_label,
      plant_pattern: 'NONE',
      created_at: new Date(startTimeMs - account_age_days * 86400000).toISOString()
    });
  }

  // 2. Plant 6 Suspicious Mule Rings (~45 Mule Accounts)

  // RING 1: Fan-in then Fan-out (Aggregator Mule + Distribution)
  const ring1Mules: Account[] = [];
  const ring1AggregatorId = createAccountId();
  const ring1Aggregator: Account = {
    account_id: ring1AggregatorId,
    upi_id: `rohit.sharma.agg@okhdfc`,
    holder_name: 'Rohit Sharma',
    bank: 'HDFC Bank',
    city: 'Mumbai',
    account_age_days: 42,
    kyc_level: 'MINIMUM',
    device_id: 'DEV-RING1-AGG',
    ip_cluster: '182.70.12.*',
    declared_monthly_income: 22000,
    age_group: '18-25',
    region: 'West',
    account_type: 'SAVINGS',
    ground_truth_label: 'MULE',
    fraud_ring_id: 'RING-01',
    plant_pattern: 'FAN_IN_FAN_OUT',
    created_at: new Date(startTimeMs + 2 * 86400000).toISOString()
  };
  accounts.push(ring1Aggregator);
  ring1Mules.push(ring1Aggregator);

  // 4 Distributors
  for (let d = 0; d < 4; d++) {
    const accId = createAccountId();
    const distAcc: Account = {
      account_id: accId,
      upi_id: `distributor.${d + 1}@okaxis`,
      holder_name: `${rng.choice(INDIAN_FIRST_NAMES)} ${rng.choice(INDIAN_LAST_NAMES)}`,
      bank: 'Axis Bank',
      city: 'Pune',
      account_age_days: rng.nextInt(20, 60),
      kyc_level: 'SIMPLIFIED',
      device_id: `DEV-RING1-D${d}`,
      ip_cluster: '182.70.12.*',
      declared_monthly_income: 18000,
      age_group: '18-25',
      region: 'West',
      account_type: 'SAVINGS',
      ground_truth_label: 'MULE',
      fraud_ring_id: 'RING-01',
      plant_pattern: 'FAN_IN_FAN_OUT',
      created_at: new Date(startTimeMs + 3 * 86400000).toISOString()
    };
    accounts.push(distAcc);
    ring1Mules.push(distAcc);
  }

  // RING 2: Layering Chain (5 Hops in < 45 mins ending in ATM / Cashout)
  const ring2Mules: Account[] = [];
  for (let h = 0; h < 5; h++) {
    const accId = createAccountId();
    const mule: Account = {
      account_id: accId,
      upi_id: `layer.hop${h + 1}@oksbi`,
      holder_name: `${rng.choice(INDIAN_FIRST_NAMES)} ${rng.choice(INDIAN_LAST_NAMES)}`,
      bank: 'State Bank of India',
      city: 'Delhi',
      account_age_days: rng.nextInt(15, 55),
      kyc_level: 'MINIMUM',
      device_id: `DEV-RING2-H${h}`,
      ip_cluster: '103.45.19.*',
      declared_monthly_income: 20000,
      age_group: '18-25',
      region: 'North',
      account_type: 'SAVINGS',
      ground_truth_label: 'MULE',
      fraud_ring_id: 'RING-02',
      plant_pattern: 'LAYERING_CHAIN',
      created_at: new Date(startTimeMs + 4 * 86400000).toISOString()
    };
    accounts.push(mule);
    ring2Mules.push(mule);
  }

  // RING 3: Circular Money Flow (Directed Cycle A -> B -> C -> D -> A)
  const ring3Mules: Account[] = [];
  for (let c = 0; c < 4; c++) {
    const accId = createAccountId();
    const mule: Account = {
      account_id: accId,
      upi_id: `cycle.node${c + 1}@okicici`,
      holder_name: `${rng.choice(INDIAN_FIRST_NAMES)} ${rng.choice(INDIAN_LAST_NAMES)}`,
      bank: 'ICICI Bank',
      city: 'Bengaluru',
      account_age_days: rng.nextInt(30, 90),
      kyc_level: 'FULL',
      device_id: `DEV-RING3-C${c}`,
      ip_cluster: '115.98.22.*',
      declared_monthly_income: 30000,
      age_group: '26-35',
      region: 'South',
      account_type: 'CURRENT',
      ground_truth_label: 'MULE',
      fraud_ring_id: 'RING-03',
      plant_pattern: 'CIRCULAR_FLOW',
      created_at: new Date(startTimeMs + 1 * 86400000).toISOString()
    };
    accounts.push(mule);
    ring3Mules.push(mule);
  }

  // RING 4: Structuring (Smurfing just below Rs 50,000 / Rs 10,000 threshold)
  const ring4Mules: Account[] = [];
  for (let s = 0; s < 6; s++) {
    const accId = createAccountId();
    const mule: Account = {
      account_id: accId,
      upi_id: `struct.smurf${s + 1}@okkotak`,
      holder_name: `${rng.choice(INDIAN_FIRST_NAMES)} ${rng.choice(INDIAN_LAST_NAMES)}`,
      bank: 'Kotak Mahindra Bank',
      city: 'Jaipur',
      account_age_days: rng.nextInt(25, 80),
      kyc_level: 'MINIMUM',
      device_id: `DEV-RING4-S${s}`,
      ip_cluster: '122.160.8.*',
      declared_monthly_income: 25000,
      age_group: '26-35',
      region: 'North',
      account_type: 'SAVINGS',
      ground_truth_label: 'MULE',
      fraud_ring_id: 'RING-04',
      plant_pattern: 'STRUCTURING',
      created_at: new Date(startTimeMs + 5 * 86400000).toISOString()
    };
    accounts.push(mule);
    ring4Mules.push(mule);
  }

  // RING 5: Shared Device & IP Cluster (All 6 share DEV-FRAUD-SHARED & 103.21.54.*)
  const ring5Mules: Account[] = [];
  for (let sh = 0; sh < 6; sh++) {
    const accId = createAccountId();
    const mule: Account = {
      account_id: accId,
      upi_id: `shared.device${sh + 1}@okpnb`,
      holder_name: `${rng.choice(INDIAN_FIRST_NAMES)} ${rng.choice(INDIAN_LAST_NAMES)}`,
      bank: 'Punjab National Bank',
      city: 'Surat',
      account_age_days: rng.nextInt(10, 45),
      kyc_level: 'SIMPLIFIED',
      device_id: 'DEV-SHARED-FRAUD-99', // Identical device!
      ip_cluster: '103.21.54.*',          // Identical IP cluster!
      declared_monthly_income: 16000,
      age_group: '18-25',
      region: 'West',
      account_type: 'SAVINGS',
      ground_truth_label: 'MULE',
      fraud_ring_id: 'RING-05',
      plant_pattern: 'SHARED_DEVICE',
      created_at: new Date(startTimeMs + 6 * 86400000).toISOString()
    };
    accounts.push(mule);
    ring5Mules.push(mule);
  }

  // RING 6: New Account Burst (Account age < 14 days, declared 15k, moves 15 Lakhs in 48h)
  const ring6Mules: Account[] = [];
  for (let b = 0; b < 4; b++) {
    const accId = createAccountId();
    const mule: Account = {
      account_id: accId,
      upi_id: `burst.new${b + 1}@okcanara`,
      holder_name: `${rng.choice(INDIAN_FIRST_NAMES)} ${rng.choice(INDIAN_LAST_NAMES)}`,
      bank: 'Canara Bank',
      city: 'Hyderabad',
      account_age_days: rng.nextInt(4, 12), // Brand new!
      kyc_level: 'MINIMUM',
      device_id: `DEV-RING6-B${b}`,
      ip_cluster: '117.200.31.*',
      declared_monthly_income: 15000,
      age_group: '18-25',
      region: 'South',
      account_type: 'SAVINGS',
      ground_truth_label: 'MULE',
      fraud_ring_id: 'RING-06',
      plant_pattern: 'NEW_ACCOUNT_BURST',
      created_at: new Date(now.getTime() - rng.nextInt(4, 12) * 86400000).toISOString()
    };
    accounts.push(mule);
    ring6Mules.push(mule);
  }

  // 3. GENERATE NORMAL TRANSACTIONS (~2,800 txns across normal accounts)
  const normalAccounts = accounts.filter(a => a.ground_truth_label === 'NORMAL' || a.ground_truth_label === 'MERCHANT_FALSE_POSITIVE');
  const merchantAccount = accounts.find(a => a.account_id === 'AC-1011') || normalAccounts[10];

  // (a) Normal peer-to-peer and merchant payments
  for (let i = 0; i < 2750; i++) {
    const from = rng.choice(normalAccounts);
    let to = rng.choice(normalAccounts);
    while (to.account_id === from.account_id) {
      to = rng.choice(normalAccounts);
    }

    const txnTimeMs = startTimeMs + rng.nextFloat(0, thirtyDaysMs);
    const txnDate = new Date(txnTimeMs);
    // Typical normal daytime hour (7am to 10pm)
    const hour = rng.nextInt(7, 22);
    txnDate.setUTCHours(hour, rng.nextInt(0, 59), rng.nextInt(0, 59));

    const channel: ChannelType = rng.choice(['UPI', 'UPI', 'UPI', 'IMPS', 'NEFT']);
    const amount = rng.nextInt(100, 15000);

    transactions.push({
      txn_id: createTxnId(),
      timestamp: txnDate.toISOString(),
      from_account: from.account_id,
      to_account: to.account_id,
      amount,
      channel,
      transaction_status: 'COMPLETED',
      transaction_note: rng.choice(['Dinner split', 'Groceries', 'Cab fare', 'Recharge', 'Rent share', 'Utilities', 'Snacks', 'Book purchase']),
      reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
      is_suspicious: false
    });
  }

  // (b) Legitimate high volume merchant transactions (Kirana store false positive)
  for (let m = 0; m < 180; m++) {
    const customer = rng.choice(normalAccounts);
    if (customer.account_id === merchantAccount.account_id) continue;
    const txnTimeMs = startTimeMs + rng.nextFloat(0, thirtyDaysMs);
    const txnDate = new Date(txnTimeMs);
    txnDate.setUTCHours(rng.nextInt(9, 21), rng.nextInt(0, 59));

    transactions.push({
      txn_id: createTxnId(),
      timestamp: txnDate.toISOString(),
      from_account: customer.account_id,
      to_account: merchantAccount.account_id,
      amount: rng.nextInt(80, 2400),
      channel: 'UPI',
      transaction_status: 'COMPLETED',
      transaction_note: 'Store QR Payment',
      reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
      is_suspicious: false
    });
  }

  // 4. PLANT SUSPICIOUS TRANSACTIONS FOR THE 6 MULE RINGS (~450 txns)

  // (A) Pattern 1: Fan-in then Fan-out
  // 10 victims transfer to Ring 1 Aggregator within 3 hours, then aggregator rapidly transfers to 4 distributors
  const ring1BaseTime = startTimeMs + 18 * 86400000 + 14 * 3600000; // Day 18, 2 PM
  let totalAggregated = 0;
  for (let v = 0; v < 8; v++) {
    const victim = normalAccounts[v * 4];
    const victimAmount = rng.choice([48000, 65000, 72000, 55000, 80000, 95000]);
    totalAggregated += victimAmount;
    const vTime = new Date(ring1BaseTime + v * 12 * 60000); // 12 mins apart

    transactions.push({
      txn_id: createTxnId(),
      timestamp: vTime.toISOString(),
      from_account: victim.account_id,
      to_account: ring1Aggregator.account_id,
      amount: victimAmount,
      channel: 'UPI',
      transaction_status: 'COMPLETED',
      transaction_note: 'Urgent lottery fee / deposit',
      reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
      is_suspicious: true
    });
  }

  // Aggregator distributes ~96% of money within 25 minutes of receiving last payment!
  const disperseTime = ring1BaseTime + 8 * 12 * 60000 + 15 * 60000;
  const chunkAmount = Math.floor((totalAggregated * 0.96) / 4);
  for (let d = 0; d < 4; d++) {
    const distributor = ring1Mules[d + 1];
    const dTime = new Date(disperseTime + d * 5 * 60000);

    transactions.push({
      txn_id: createTxnId(),
      timestamp: dTime.toISOString(),
      from_account: ring1Aggregator.account_id,
      to_account: distributor.account_id,
      amount: chunkAmount,
      channel: 'IMPS',
      transaction_status: 'COMPLETED',
      transaction_note: 'Commission settlement',
      reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
      is_suspicious: true
    });
  }

  // (B) Pattern 2: Layering Chain (4-6 Hops in < 45 mins ending in ATM / Cashout)
  const ring2BaseTime = startTimeMs + 22 * 86400000 + 23 * 3600000; // Day 22, 11 PM (night)
  const victim2 = normalAccounts[55];
  let currentLayerAmount = 350000;

  // Hop 0: Victim -> Mule 0
  transactions.push({
    txn_id: createTxnId(),
    timestamp: new Date(ring2BaseTime).toISOString(),
    from_account: victim2.account_id,
    to_account: ring2Mules[0].account_id,
    amount: currentLayerAmount,
    channel: 'NEFT',
    transaction_status: 'COMPLETED',
    transaction_note: 'Investment deposit',
    reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
    is_suspicious: true
  });

  // Hops 1 -> 2 -> 3 -> 4
  for (let h = 0; h < 4; h++) {
    const fromMule = ring2Mules[h];
    const toMule = ring2Mules[h + 1];
    // Each hop retains a small 1-2% cut and transfers within 7-10 minutes!
    currentLayerAmount = Math.floor(currentLayerAmount * 0.985);
    const hopTime = new Date(ring2BaseTime + (h + 1) * 8 * 60000);

    transactions.push({
      txn_id: createTxnId(),
      timestamp: hopTime.toISOString(),
      from_account: fromMule.account_id,
      to_account: toMule.account_id,
      amount: currentLayerAmount,
      channel: 'IMPS',
      transaction_status: 'COMPLETED',
      transaction_note: `Tranche layer ${h + 1}`,
      reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
      is_suspicious: true
    });
  }

  // Final Cashout: Mule 4 ATM / Digital Asset Cashout
  transactions.push({
    txn_id: createTxnId(),
    timestamp: new Date(ring2BaseTime + 45 * 60000).toISOString(),
    from_account: ring2Mules[4].account_id,
    to_account: 'AC-CASHOUT-ATM',
    amount: Math.floor(currentLayerAmount * 0.98),
    channel: 'ATM_WITHDRAWAL',
    transaction_status: 'COMPLETED',
    transaction_note: 'ATM cash withdrawal max',
    reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
    is_suspicious: true
  });

  // (C) Pattern 3: Circular Money Flow (A -> B -> C -> D -> A)
  const ring3BaseTime = startTimeMs + 12 * 86400000 + 11 * 3600000;
  for (let round = 0; round < 3; round++) {
    const cycleAmount = 185000 - round * 5000;
    for (let c = 0; c < 4; c++) {
      const fromAcc = ring3Mules[c];
      const toAcc = ring3Mules[(c + 1) % 4];
      const cTime = new Date(ring3BaseTime + round * 86400000 + c * 40 * 60000);

      transactions.push({
        txn_id: createTxnId(),
        timestamp: cTime.toISOString(),
        from_account: fromAcc.account_id,
        to_account: toAcc.account_id,
        amount: cycleAmount,
        channel: 'IMPS',
        transaction_status: 'COMPLETED',
        transaction_note: `Business circular settlement R${round + 1}`,
        reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
        is_suspicious: true
      });
    }
  }

  // (D) Pattern 4: Structuring (Smurfing just below Rs 50,000 / Rs 10,000)
  const ring4BaseTime = startTimeMs + 15 * 86400000 + 16 * 3600000;
  // Multiple transactions structured at ₹49,200, ₹48,800, ₹49,500, ₹9,850
  for (let s = 0; s < ring4Mules.length; s++) {
    const targetMule = ring4Mules[s];
    for (let txn = 0; txn < 5; txn++) {
      const smurfAmount = rng.choice([49200, 48900, 49500, 48500, 9800, 9900]);
      const sTime = new Date(ring4BaseTime + s * 4 * 3600000 + txn * 25 * 60000);

      // Sender is an unlinked source account
      const sender = normalAccounts[(s * 5 + txn) % normalAccounts.length];
      transactions.push({
        txn_id: createTxnId(),
        timestamp: sTime.toISOString(),
        from_account: sender.account_id,
        to_account: targetMule.account_id,
        amount: smurfAmount,
        channel: 'UPI',
        transaction_status: 'COMPLETED',
        transaction_note: 'Consultancy advance payment',
        reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
        is_suspicious: true
      });
    }
  }

  // (E) Pattern 5: Shared Device & IP Night Transactions
  const ring5BaseTime = startTimeMs + 25 * 86400000;
  for (let sh = 0; sh < ring5Mules.length; sh++) {
    const fromM = ring5Mules[sh];
    const toM = ring5Mules[(sh + 1) % ring5Mules.length];
    for (let k = 0; k < 3; k++) {
      const nightDate = new Date(ring5BaseTime + k * 86400000);
      nightDate.setUTCHours(rng.nextInt(1, 4), rng.nextInt(5, 55)); // 1 AM to 4 AM!

      transactions.push({
        txn_id: createTxnId(),
        timestamp: nightDate.toISOString(),
        from_account: fromM.account_id,
        to_account: toM.account_id,
        amount: rng.nextInt(35000, 95000),
        channel: 'UPI',
        transaction_status: 'COMPLETED',
        transaction_note: 'Device network sync',
        reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
        is_suspicious: true
      });
    }
  }

  // (F) Pattern 6: New Account Burst (Account age < 14d, massive credit & rapid cashout)
  const ring6BaseTime = startTimeMs + 27 * 86400000 + 10 * 3600000;
  for (let b = 0; b < ring6Mules.length; b++) {
    const burstMule = ring6Mules[b];
    // Inflow: 3 large payments totaling ₹6,00,000 from unknown sources
    for (let inf = 0; inf < 3; inf++) {
      const sourceAcc = normalAccounts[(b * 3 + inf + 30) % normalAccounts.length];
      const infTime = new Date(ring6BaseTime + b * 6 * 3600000 + inf * 45 * 60000);

      transactions.push({
        txn_id: createTxnId(),
        timestamp: infTime.toISOString(),
        from_account: sourceAcc.account_id,
        to_account: burstMule.account_id,
        amount: 200000,
        channel: 'IMPS',
        transaction_status: 'COMPLETED',
        transaction_note: 'Contractor lump sum',
        reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
        is_suspicious: true
      });
    }

    // Outflow within 2 hours: Transfer to digital asset cashout
    const outTime = new Date(ring6BaseTime + b * 6 * 3600000 + 150 * 60000);
    transactions.push({
      txn_id: createTxnId(),
      timestamp: outTime.toISOString(),
      from_account: burstMule.account_id,
      to_account: 'AC-CRYPTO-DESK',
      amount: 585000,
      channel: 'DIGITAL_ASSET_CASHOUT',
      transaction_status: 'COMPLETED',
      transaction_note: 'P2P Exchange Settlement',
      reference_id: `REF${rng.nextInt(10000000, 99999999)}`,
      is_suspicious: true
    });
  }

  // Sort all transactions chronologically
  transactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const muleCount = accounts.filter(a => a.ground_truth_label === 'MULE').length;

  return {
    accounts,
    transactions,
    metadata: {
      seed,
      generatedAt: new Date().toISOString(),
      accountCount: accounts.length,
      transactionCount: transactions.length,
      muleCount,
      ringCount: 6,
      totalVolume
    }
  };
}
