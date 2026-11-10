import React, { useEffect } from 'react';
import { useUiStore, PageId } from './store/uiStore';
import { useDatasetStore } from './store/datasetStore';
import { useAnalysisStore } from './store/analysisStore';
import { useInvestigationStore } from './store/investigationStore';

import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { AccountDrawer } from './components/layout/AccountDrawer';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/layout/ToastContainer';
import { CopilotModal } from './components/investigation/CopilotModal';

// Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { NetworkExplorerPage } from './pages/NetworkExplorer/NetworkExplorerPage';
import { AccountIntelligencePage } from './pages/AccountIntelligence/AccountIntelligencePage';
import { RingInvestigatorPage } from './pages/RingInvestigator/RingInvestigatorPage';
import { FollowTheMoneyPage } from './pages/FollowTheMoney/FollowTheMoneyPage';
import { AlertQueuePage } from './pages/AlertQueue/AlertQueuePage';
import { LiveMonitoringPage } from './pages/LiveMonitoring/LiveMonitoringPage';
import { ModelPerformancePage } from './pages/ModelPerformance/ModelPerformancePage';
import { FairnessPrivacyPage } from './pages/FairnessPrivacy/FairnessPrivacyPage';
import { FederatedLearningPage } from './pages/FederatedLearning/FederatedLearningPage';
import { GlobalContextPage } from './pages/GlobalContext/GlobalContextPage';
import { HowAiWorksPage } from './pages/HowAIWorks/HowAiWorksPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { DemoLabPage } from './pages/DemoLab/DemoLabPage';
import { SafeToPayPage } from './pages/SafeToPay/SafeToPayPage';
import { OnboardingRiskPage } from './pages/OnboardingRisk/OnboardingRiskPage';
import { RedTeamPage } from './pages/RedTeam/RedTeamPage';
import { CashoutMapPage } from './pages/CashoutMap/CashoutMapPage';

export const App: React.FC = () => {
  const { activePage } = useUiStore();
  const { accounts, transactions } = useDatasetStore();
  const { runAnalysis, lastAnalyzedAt, riskResults } = useAnalysisStore();
  const { syncAlertsFromRisk } = useInvestigationStore();

  // Run initial AI analysis on mount if not yet executed
  useEffect(() => {
    if (!lastAnalyzedAt && accounts.length > 0) {
      runAnalysis(accounts, transactions);
    }
  }, [accounts, transactions, lastAnalyzedAt, runAnalysis]);

  // Sync alerts queue whenever riskResults are recomputed
  useEffect(() => {
    if (riskResults.size > 0 && accounts.length > 0) {
      syncAlertsFromRisk(riskResults, accounts);
    }
  }, [riskResults, accounts, syncAlertsFromRisk]);

  const renderActivePage = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage />;
      case 'network':
        return <NetworkExplorerPage />;
      case 'account':
        return <AccountIntelligencePage />;
      case 'rings':
        return <RingInvestigatorPage />;
      case 'money':
        return <FollowTheMoneyPage />;
      case 'alerts':
        return <AlertQueuePage />;
      case 'live':
        return <LiveMonitoringPage />;
      case 'model':
        return <ModelPerformancePage />;
      case 'fairness':
        return <FairnessPrivacyPage />;
      case 'federated':
        return <FederatedLearningPage />;
      case 'global':
        return <GlobalContextPage />;
      case 'howai':
        return <HowAiWorksPage />;
      case 'reports':
        return <ReportsPage />;
      case 'demo':
        return <DemoLabPage />;
      case 'safetopay':
        return <SafeToPayPage />;
      case 'onboarding':
        return <OnboardingRiskPage />;
      case 'redteam':
        return <RedTeamPage />;
      case 'cashout':
        return <CashoutMapPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-navy-950 text-slate-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Global Topbar */}
        <Topbar />

        {/* Active Page Viewport */}
        <main className="flex-1 overflow-y-auto bg-slatebg-dark/95">
          {renderActivePage(activePage)}
        </main>
      </div>

      {/* Sliding Right-Side Account Inspection Drawer */}
      <AccountDrawer />

      {/* Ctrl+K Command Palette Modal */}
      <CommandPalette />

      {/* AI Investigation Copilot Offline Chat Modal */}
      <CopilotModal />

      {/* Floating System Notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;
