import Papa from 'papaparse';
import { Account, Transaction, KycLevel, AgeGroup, Region, AccountType, GroundTruthLabel, ChannelType } from '../types';

export interface CsvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  importedAccounts?: Account[];
  importedTransactions?: Transaction[];
}

export function exportAccountsToCsv(accounts: Account[]): string {
  return Papa.unparse(accounts);
}

export function exportTransactionsToCsv(transactions: Transaction[]): string {
  return Papa.unparse(transactions);
}

export function exportDatasetToJson(accounts: Account[], transactions: Transaction[]): string {
  return JSON.stringify({ accounts, transactions }, null, 2);
}

export function parseAndValidateAccountsCsv(csvString: string): CsvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsed = Papa.parse(csvString, { header: true, skipEmptyLines: true });

  if (parsed.errors.length > 0) {
    parsed.errors.forEach(e => errors.push(`CSV Syntax error row ${e.row}: ${e.message}`));
  }

  const data = parsed.data as any[];
  if (!Array.isArray(data) || data.length === 0) {
    return { valid: false, errors: ['CSV contains no account records.'], warnings };
  }

  const validAccounts: Account[] = [];
  const seenIds = new Set<string>();

  data.forEach((row, idx) => {
    const rowNum = idx + 2;
    if (!row.account_id || !row.holder_name) {
      errors.push(`Row ${rowNum}: Missing mandatory account_id or holder_name.`);
      return;
    }

    if (seenIds.has(row.account_id)) {
      errors.push(`Row ${rowNum}: Duplicate account_id '${row.account_id}'.`);
      return;
    }
    seenIds.add(row.account_id);

    const income = Number(row.declared_monthly_income);
    if (isNaN(income) || income < 0) {
      warnings.push(`Row ${rowNum}: Invalid or negative income for ${row.account_id}, defaulting to ₹25,000.`);
    }

    const ageDays = Number(row.account_age_days);
    if (isNaN(ageDays) || ageDays < 0) {
      warnings.push(`Row ${rowNum}: Invalid account_age_days for ${row.account_id}, defaulting to 180.`);
    }

    validAccounts.push({
      account_id: String(row.account_id).trim(),
      upi_id: String(row.upi_id || `${row.account_id.toLowerCase()}@bank`).trim(),
      holder_name: String(row.holder_name).trim(),
      bank: String(row.bank || 'State Bank of India').trim(),
      city: String(row.city || 'Mumbai').trim(),
      account_age_days: !isNaN(ageDays) && ageDays >= 0 ? ageDays : 180,
      kyc_level: (['FULL', 'MINIMUM', 'SIMPLIFIED'].includes(row.kyc_level) ? row.kyc_level : 'FULL') as KycLevel,
      device_id: String(row.device_id || `DEV-${Math.floor(Math.random() * 90000 + 10000)}`),
      ip_cluster: String(row.ip_cluster || '103.11.22.*'),
      declared_monthly_income: !isNaN(income) && income >= 0 ? income : 25000,
      age_group: (['18-25', '26-35', '36-50', '51+'].includes(row.age_group) ? row.age_group : '26-35') as AgeGroup,
      region: (['North', 'South', 'West', 'East', 'Central'].includes(row.region) ? row.region : 'West') as Region,
      account_type: (['SAVINGS', 'CURRENT', 'SALARY', 'MERCHANT', 'STUDENT'].includes(row.account_type) ? row.account_type : 'SAVINGS') as AccountType,
      ground_truth_label: (['MULE', 'NORMAL', 'VICTIM', 'MERCHANT_FALSE_POSITIVE'].includes(row.ground_truth_label) ? row.ground_truth_label : 'NORMAL') as GroundTruthLabel,
      plant_pattern: 'NONE',
      created_at: row.created_at || new Date().toISOString()
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    importedAccounts: validAccounts
  };
}

export function parseAndValidateTransactionsCsv(csvString: string, existingAccountIds?: Set<string>): CsvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsed = Papa.parse(csvString, { header: true, skipEmptyLines: true });

  if (parsed.errors.length > 0) {
    parsed.errors.forEach(e => errors.push(`CSV Syntax error row ${e.row}: ${e.message}`));
  }

  const data = parsed.data as any[];
  if (!Array.isArray(data) || data.length === 0) {
    return { valid: false, errors: ['CSV contains no transaction records.'], warnings };
  }

  const validTransactions: Transaction[] = [];
  const seenTxnIds = new Set<string>();

  data.forEach((row, idx) => {
    const rowNum = idx + 2;
    if (!row.txn_id || !row.from_account || !row.to_account || row.amount === undefined) {
      errors.push(`Row ${rowNum}: Missing mandatory fields (txn_id, from_account, to_account, amount).`);
      return;
    }

    if (seenTxnIds.has(row.txn_id)) {
      errors.push(`Row ${rowNum}: Duplicate txn_id '${row.txn_id}'.`);
      return;
    }
    seenTxnIds.add(row.txn_id);

    const amount = Number(row.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push(`Row ${rowNum}: Invalid transaction amount '${row.amount}'. Must be positive.`);
      return;
    }

    if (row.from_account === row.to_account) {
      errors.push(`Row ${rowNum}: Self-transfer detected (from_account equals to_account).`);
      return;
    }

    if (existingAccountIds && (!existingAccountIds.has(row.from_account) || !existingAccountIds.has(row.to_account))) {
      warnings.push(`Row ${rowNum}: Transaction references account not in current database (${row.from_account} -> ${row.to_account}).`);
    }

    const timestamp = row.timestamp ? new Date(row.timestamp).toISOString() : new Date().toISOString();

    validTransactions.push({
      txn_id: String(row.txn_id).trim(),
      timestamp,
      from_account: String(row.from_account).trim(),
      to_account: String(row.to_account).trim(),
      amount,
      channel: (['UPI', 'IMPS', 'NEFT', 'ATM_WITHDRAWAL', 'MERCHANT_TRANSFER', 'DIGITAL_ASSET_CASHOUT'].includes(row.channel) ? row.channel : 'UPI') as ChannelType,
      transaction_status: 'COMPLETED',
      transaction_note: String(row.transaction_note || 'Transfer'),
      reference_id: String(row.reference_id || `REF${Math.floor(Math.random() * 90000000 + 10000000)}`),
      is_suspicious: false
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    importedTransactions: validTransactions
  };
}

export function downloadSampleAccountsTemplate(): void {
  const sample = [
    {
      account_id: 'AC-9001',
      upi_id: 'sample.user@okhdfc',
      holder_name: 'Aditya Gupta',
      bank: 'HDFC Bank',
      city: 'Mumbai',
      account_age_days: 180,
      kyc_level: 'FULL',
      device_id: 'DEV-10921',
      ip_cluster: '103.22.45.*',
      declared_monthly_income: 65000,
      age_group: '26-35',
      region: 'West',
      account_type: 'SAVINGS',
      ground_truth_label: 'NORMAL'
    }
  ];
  downloadFile('muletrace_accounts_template.csv', Papa.unparse(sample), 'text/csv');
}

export function downloadSampleTransactionsTemplate(): void {
  const sample = [
    {
      txn_id: 'TXN-800101',
      timestamp: '2026-11-01T12:30:00Z',
      from_account: 'AC-1001',
      to_account: 'AC-1002',
      amount: 4500,
      channel: 'UPI',
      transaction_note: 'Dinner payment',
      reference_id: 'REF99882211'
    }
  ];
  downloadFile('muletrace_transactions_template.csv', Papa.unparse(sample), 'text/csv');
}

function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
