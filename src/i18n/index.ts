export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  appName: string;
  tagline: string;
  disclaimer: string;
  nav: {
    dashboard: string;
    networkExplorer: string;
    accountIntel: string;
    ringInvestigator: string;
    followMoney: string;
    alertQueue: string;
    liveMonitoring: string;
    modelLab: string;
    fairnessPrivacy: string;
    federatedLearning: string;
    globalContext: string;
    howAiWorks: string;
    reports: string;
    demoLab: string;
    safeToPay: string;
    onboardingCheck: string;
    redTeam: string;
    cashoutMap: string;
  };
  actions: {
    runAnalysis: string;
    regenerate: string;
    exportReport: string;
    exportCsv: string;
    importCsv: string;
    freezeSimulated: string;
    escalate1930: string;
    requestKyc: string;
    markFalsePositive: string;
    filter: string;
    search: string;
    viewDetails: string;
    play: string;
    pause: string;
    reset: string;
  };
  risk: {
    high: string;
    review: string;
    low: string;
    critical: string;
    score: string;
    confidence: string;
  };
  metrics: {
    scannedAccounts: string;
    analysedTxns: string;
    flaggedMules: string;
    detectedRings: string;
    interceptableAmount: string;
    totalExposure: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'MuleTrace AI',
    tagline: 'Trace Suspicious Money. Uncover Hidden Networks. Protect Financial Systems.',
    disclaimer: 'Educational prototype using synthetic financial data. Not for real banking decisions or criminal attribution. All actions must undergo human analyst review.',
    nav: {
      dashboard: 'Command Center',
      networkExplorer: 'Network Explorer',
      accountIntel: 'Account Intelligence',
      ringInvestigator: 'Mule Ring Investigator',
      followMoney: 'Follow the Money',
      alertQueue: 'Alert Queue',
      liveMonitoring: 'Live Monitoring',
      modelLab: 'Model Performance Lab',
      fairnessPrivacy: 'Fairness & Privacy',
      federatedLearning: 'Federated Learning',
      globalContext: 'India & Global Context',
      howAiWorks: 'How AI Works',
      reports: 'Reports & Cases',
      demoLab: 'Scenario & Demo Lab',
      safeToPay: 'Safe-to-Pay Checker',
      onboardingCheck: 'Onboarding Risk Check',
      redTeam: 'Red-Team Simulator',
      cashoutMap: 'Cash-out Hotspots'
    },
    actions: {
      runAnalysis: 'Run AI Analysis',
      regenerate: 'Regenerate Dataset',
      exportReport: 'Export Case Docket',
      exportCsv: 'Export CSV',
      importCsv: 'Import Custom CSV',
      freezeSimulated: 'Simulate Account Freeze',
      escalate1930: 'Escalate to Cybercrime (1930)',
      requestKyc: 'Request KYC Re-verification',
      markFalsePositive: 'Mark False Positive',
      filter: 'Filter',
      search: 'Search account, name or UPI ID...',
      viewDetails: 'Inspect Account',
      play: 'Play Flow',
      pause: 'Pause Flow',
      reset: 'Reset'
    },
    risk: {
      high: 'High Risk',
      review: 'Under Review',
      low: 'Low Risk',
      critical: 'Critical Risk',
      score: 'Mule Risk Score',
      confidence: 'Confidence'
    },
    metrics: {
      scannedAccounts: 'Accounts Scanned',
      analysedTxns: 'Transactions Analysed',
      flaggedMules: 'Flagged Mule Accounts',
      detectedRings: 'Detected Mule Rings',
      interceptableAmount: 'Potentially Interceptable',
      totalExposure: 'Suspected Flow Exposure'
    }
  },
  hi: {
    appName: 'म्यूल-ट्रेस एआई',
    tagline: 'संदिग्ध धन का पता लगाएं। छिपे हुए वित्तीय नेटवर्क को उजागर करें।',
    disclaimer: 'सिंथेटिक वित्तीय डेटा पर आधारित शैक्षिक प्रोटोटाइप। वास्तविक बैंकिंग निर्णयों या कानूनी आरोपों के लिए नहीं। मानव विश्लेषक समीक्षा अनिवार्य है।',
    nav: {
      dashboard: 'कमांड सेंटर',
      networkExplorer: 'नेटवर्क एक्सप्लोरर',
      accountIntel: 'खाता इंटेलिजेंस',
      ringInvestigator: 'म्यूल रिंग अन्वेषक',
      followMoney: 'धन प्रवाह ट्रेस करें',
      alertQueue: 'अलर्ट कतार',
      liveMonitoring: 'लाइव मॉनिटरिंग',
      modelLab: 'मॉडल प्रदर्शन लैब',
      fairnessPrivacy: 'निष्पक्षता और गोपनीयता',
      federatedLearning: 'फेडरेटेड लर्निंग',
      globalContext: 'भारत और वैश्विक संदर्भ',
      howAiWorks: 'एआई कैसे काम करता है',
      reports: 'रिपोर्ट और केस प्रबंधन',
      demoLab: 'डेमो और परिदृश्य लैब',
      safeToPay: 'सुरक्षित भुगतान जांच',
      onboardingCheck: 'ऑनबोर्डिंग जोखिम जांच',
      redTeam: 'रेड-टीम सिम्युलेटर',
      cashoutMap: 'कैश-आउट हॉटस्पॉट'
    },
    actions: {
      runAnalysis: 'एआई विश्लेषण चलाएं',
      regenerate: 'डेटासेट पुनः बनाएं',
      exportReport: 'केस रिपोर्ट निर्यात करें',
      exportCsv: 'सीएसवी निर्यात',
      importCsv: 'सीएसवी आयात करें',
      freezeSimulated: 'खाता फ्रीज अनुकरण करें',
      escalate1930: 'साइबर सेल (1930) को भेजें',
      requestKyc: 'केवाईसी पुनः सत्यापन मांगें',
      markFalsePositive: 'गलत सकारात्मक चिह्नित करें',
      filter: 'फ़िल्टर',
      search: 'खाता संख्या, नाम या यूपीआई खोजें...',
      viewDetails: 'खाता विवरण देखें',
      play: 'प्रवाह चलाएं',
      pause: 'रोकें',
      reset: 'रीसेट करें'
    },
    risk: {
      high: 'उच्च जोखिम',
      review: 'समीक्षा अधीन',
      low: 'निम्न जोखिम',
      critical: 'अत्यधिक जोखिम',
      score: 'म्यूल जोखिम स्कोर',
      confidence: 'विश्वसनीयता'
    },
    metrics: {
      scannedAccounts: 'स्कैन किए गए खाते',
      analysedTxns: 'विश्लेषित लेनदेन',
      flaggedMules: 'पहचाने गए म्यूल खाते',
      detectedRings: 'पहचानी गई धोखाधड़ी रिंग्स',
      interceptableAmount: 'संभावित रूप से रोकी जा सकने वाली राशि',
      totalExposure: 'संदिग्ध लेनदेन राशि'
    }
  },
  kn: {
    appName: 'ಮ್ಯೂಲ್-ಟ್ರೇಸ್ ಎಐ',
    tagline: 'ಅನುಮಾನಾಸ್ಪದ ಹಣವನ್ನು ಪತ್ತೆಹಚ್ಚಿ. ಗುಪ್ತ ಜಾಲಗಳನ್ನು ಬಯಲಿಗೆಳೆಯಿರಿ.',
    disclaimer: 'ಕೃತಕ ಹಣಕಾಸು ಡೇಟಾವನ್ನು ಬಳಸುವ ಶೈಕ್ಷಣಿಕ ಮೂಲಮಾದರಿ. ನೈಜ ಬ್ಯಾಂಕಿಂಗ್ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ಅಲ್ಲ. ಮಾನವ ವಿಶ್ಲೇಷಕರ ಪರಿಶೀಲನೆ ಅತ್ಯಗತ್ಯ.',
    nav: {
      dashboard: 'ಕಮಾಂಡ್ ಸೆಂಟರ್',
      networkExplorer: 'ನೆಟ್‌ವರ್ಕ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್',
      accountIntel: 'ಖಾತೆ ಗುಪ್ತಚರ',
      ringInvestigator: 'ಮ್ಯೂಲ್ ರಿಂಗ್ ತನಿಖಾಧಿಕಾರಿ',
      followMoney: 'ಹಣದ ಹರಿವು ಪತ್ತೆಹಚ್ಚಿ',
      alertQueue: 'ಎಚ್ಚರಿಕೆ ಕ್ಯೂ',
      liveMonitoring: 'ಲೈವ್ ಮಾನಿಟರಿಂಗ್',
      modelLab: 'ಮಾದರಿ ಕಾರ್ಯಕ್ಷಮತೆ ಲ್ಯಾಬ್',
      fairnessPrivacy: 'ನ್ಯಾಯಸಮ್ಮತತೆ ಮತ್ತು ಗೌಪ್ಯತೆ',
      federatedLearning: 'ಫೆಡರೇಟೆಡ್ ಲರ್ನಿಂಗ್',
      globalContext: 'ಭಾರತ ಮತ್ತು ಜಾಗತಿಕ ಸಂದರ್ಭ',
      howAiWorks: 'ಎಐ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
      reports: 'ವರದಿಗಳು ಮತ್ತು ಪ್ರಕರಣಗಳು',
      demoLab: 'ಡೆಮೊ ಮತ್ತು ಸನ್ನಿವೇಶ ಲ್ಯಾಬ್',
      safeToPay: 'ಸುರಕ್ಷಿತ ಪಾವತಿ ಪರಿಶೀಲಕ',
      onboardingCheck: 'ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಅಪಾಯ ಪರಿಶೀಲನೆ',
      redTeam: 'ರೆಡ್-ಟೀಮ್ ಸಿಮ್ಯುಲೇಟರ್',
      cashoutMap: 'ಕ್ಯಾಶ್-ಔಟ್ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು'
    },
    actions: {
      runAnalysis: 'ಎಐ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ',
      regenerate: 'ಡೇಟಾಸೆಟ್ ಪುನರುತ್ಪಾದಿಸಿ',
      exportReport: 'ವರದಿ ರಫ್ತು ಮಾಡಿ',
      exportCsv: 'ಸಿಎಸ್‌ವಿ ರಫ್ತು',
      importCsv: 'ಸಿಎಸ್‌ವಿ ಆಮದು ಮಾಡಿ',
      freezeSimulated: 'ಖಾತೆ ಫ್ರೀಜ್ ಸಿಮ್ಯುಲೇಶನ್',
      escalate1930: 'ಸೈಬರ್ ಸೆಲ್ (1930) ಗೆ ವರ್ಗಾಯಿಸಿ',
      requestKyc: 'ಕೆವೈಸಿ ಮರು-ಪರಿಶೀಲನೆ ಕೇಳಿ',
      markFalsePositive: 'ತಪ್ಪು ಧನಾತ್ಮಕ ಎಂದು ಗುರುತಿಸಿ',
      filter: 'ಫಿಲ್ಟರ್',
      search: 'ಖಾತೆ, ಹೆಸರು ಅಥವಾ ಯುಪಿಐ ಐಡಿ ಹುಡುಕಿ...',
      viewDetails: 'ಖಾತೆ ವಿವರ ವೀಕ್ಷಿಸಿ',
      play: 'ಹರಿವು ಪ್ಲೇ ಮಾಡಿ',
      pause: 'ವಿರಾಮಗೊಳಿಸಿ',
      reset: 'ಮರುಹೊಂದಿಸಿ'
    },
    risk: {
      high: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
      review: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
      low: 'ಕಡಿಮೆ ಅಪಾಯ',
      critical: 'ತೀವ್ರ ಅಪಾಯ',
      score: 'ಮ್ಯೂಲ್ ರಿಸ್ಕ್ ಸ್ಕೋರ್',
      confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ'
    },
    metrics: {
      scannedAccounts: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಖಾತೆಗಳು',
      analysedTxns: 'ವಿಶ್ಲೇಷಿಸಿದ ವಹಿವಾಟುಗಳು',
      flaggedMules: 'ಗುರುತಿಸಲಾದ ಮ್ಯೂಲ್ ಖಾತೆಗಳು',
      detectedRings: 'ಪತ್ತೆಯಾದ ವಂಚನೆ ರಿಂಗ್‌ಗಳು',
      interceptableAmount: 'ತಡೆಯಬಹುದಾದ ಅಂದಾಜು ಮೊತ್ತ',
      totalExposure: 'ಅನುಮಾನಾಸ್ಪದ ಒಟ್ಟು ಮೊತ್ತ'
    }
  }
};
