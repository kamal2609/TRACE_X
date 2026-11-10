import { create } from 'zustand';
import { Account, Transaction } from '../types';
import { generateSyntheticDataset, SyntheticDataset } from '../data/syntheticGenerator';

interface DatasetState {
  accounts: Account[];
  transactions: Transaction[];
  metadata: SyntheticDataset['metadata'];
  currentSeed: number;
  isLoading: boolean;
  regenerate: (seed?: number) => void;
  reset: () => void;
  loadCustomData: (accounts: Account[], transactions: Transaction[]) => void;
  addLiveTransaction: (txn: Transaction) => void;
}

const initialDataset = generateSyntheticDataset(42819);

export const useDatasetStore = create<DatasetState>((set, get) => ({
  accounts: initialDataset.accounts,
  transactions: initialDataset.transactions,
  metadata: initialDataset.metadata,
  currentSeed: 42819,
  isLoading: false,

  regenerate: (seed?: number) => {
    const newSeed = seed !== undefined ? seed : Math.floor(Math.random() * 900000 + 100000);
    set({ isLoading: true });
    setTimeout(() => {
      const newDataset = generateSyntheticDataset(newSeed);
      set({
        accounts: newDataset.accounts,
        transactions: newDataset.transactions,
        metadata: newDataset.metadata,
        currentSeed: newSeed,
        isLoading: false
      });
    }, 150);
  },

  reset: () => {
    set({ isLoading: true });
    setTimeout(() => {
      const defaultDs = generateSyntheticDataset(42819);
      set({
        accounts: defaultDs.accounts,
        transactions: defaultDs.transactions,
        metadata: defaultDs.metadata,
        currentSeed: 42819,
        isLoading: false
      });
    }, 100);
  },

  loadCustomData: (accounts: Account[], transactions: Transaction[]) => {
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const muleCount = accounts.filter(a => a.ground_truth_label === 'MULE').length;
    set({
      accounts,
      transactions,
      metadata: {
        seed: 0,
        generatedAt: new Date().toISOString(),
        accountCount: accounts.length,
        transactionCount: transactions.length,
        muleCount,
        ringCount: 0,
        totalVolume
      }
    });
  },

  addLiveTransaction: (txn: Transaction) => {
    set(state => ({
      transactions: [txn, ...state.transactions],
      metadata: {
        ...state.metadata,
        transactionCount: state.metadata.transactionCount + 1,
        totalVolume: state.metadata.totalVolume + txn.amount
      }
    }));
  }
}));
