import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle2, FileText, Download, AlertTriangle } from 'lucide-react';
import { parseAndValidateAccountsCsv, parseAndValidateTransactionsCsv, downloadSampleAccountsTemplate, downloadSampleTransactionsTemplate } from '../../data/csvHandler';
import { useDatasetStore } from '../../store/datasetStore';
import { useAnalysisStore } from '../../store/analysisStore';
import { useUiStore } from '../../store/uiStore';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({ isOpen, onClose }) => {
  const { loadCustomData, accounts } = useDatasetStore();
  const { runAnalysis } = useAnalysisStore();
  const { addToast } = useUiStore();

  const [activeTab, setActiveTab] = useState<'accounts' | 'transactions'>('accounts');
  const [csvContent, setCsvContent] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleValidateAndImport = () => {
    setValidationErrors([]);
    setValidationWarnings([]);
    setSuccessCount(null);

    if (!csvContent.trim()) {
      setValidationErrors(['CSV file or text input cannot be empty.']);
      return;
    }

    if (activeTab === 'accounts') {
      const res = parseAndValidateAccountsCsv(csvContent);
      if (!res.valid) {
        setValidationErrors(res.errors);
        setValidationWarnings(res.warnings);
      } else if (res.importedAccounts) {
        setSuccessCount(res.importedAccounts.length);
        setValidationWarnings(res.warnings);
        // Load into store and re-run analysis
        loadCustomData(res.importedAccounts, []);
        runAnalysis(res.importedAccounts, []);
        addToast('success', 'Accounts Imported', `Loaded ${res.importedAccounts.length} custom account records.`);
      }
    } else {
      const accountIds = new Set(accounts.map(a => a.account_id));
      const res = parseAndValidateTransactionsCsv(csvContent, accountIds);
      if (!res.valid) {
        setValidationErrors(res.errors);
        setValidationWarnings(res.warnings);
      } else if (res.importedTransactions) {
        setSuccessCount(res.importedTransactions.length);
        setValidationWarnings(res.warnings);
        loadCustomData(accounts, res.importedTransactions);
        runAnalysis(accounts, res.importedTransactions);
        addToast('success', 'Transactions Imported', `Loaded ${res.importedTransactions.length} custom transactions.`);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-white text-sm">
              Custom CSV Import & Schema Validation
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection & Template Download */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono">
              <button
                onClick={() => {
                  setActiveTab('accounts');
                  setValidationErrors([]);
                  setSuccessCount(null);
                }}
                className={`px-3 py-1 rounded-md transition ${activeTab === 'accounts' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Accounts CSV
              </button>
              <button
                onClick={() => {
                  setActiveTab('transactions');
                  setValidationErrors([]);
                  setSuccessCount(null);
                }}
                className={`px-3 py-1 rounded-md transition ${activeTab === 'transactions' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Transactions CSV
              </button>
            </div>

            <button
              onClick={() => activeTab === 'accounts' ? downloadSampleAccountsTemplate() : downloadSampleTransactionsTemplate()}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 underline"
            >
              <Download className="w-3 h-3" /> Sample Template
            </button>
          </div>

          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/50 rounded-xl p-4 text-center space-y-2 bg-slate-950/40">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer block">
              <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-slate-300 font-medium block">Choose CSV File or Drag & Drop</span>
              <span className="text-[10px] text-slate-500 font-mono">Format: RFC 4180 UTF-8 CSV</span>
            </label>
          </div>

          {/* Raw Text Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Or Paste Raw CSV Data:</label>
            <textarea
              rows={5}
              value={csvContent}
              onChange={e => setCsvContent(e.target.value)}
              placeholder="account_id,holder_name,bank,declared_monthly_income,..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Validation Errors Box */}
          {validationErrors.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-rose-300">
                <AlertCircle className="w-4 h-4" /> Validation Failed ({validationErrors.length} Errors):
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] font-mono text-rose-300">
                {validationErrors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Validation Warnings Box */}
          {validationWarnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4" /> Warnings ({validationWarnings.length}):
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] font-mono text-amber-300">
                {validationWarnings.slice(0, 3).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Banner */}
          {successCount !== null && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center gap-2 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Successfully validated and imported {successCount} records!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono"
          >
            Cancel
          </button>
          <button
            onClick={handleValidateAndImport}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold transition"
          >
            Validate & Import
          </button>
        </div>
      </div>
    </div>
  );
};

