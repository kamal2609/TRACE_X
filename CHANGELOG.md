# CHANGELOG: MULETRACE AI PLATFORM

All notable changes, architectural implementations, and verification milestones for the MuleTrace AI platform are documented in this file.

---

## [1.0.0] - 2026-11-10

### Initial Release & Full Build Completion

#### Core Architecture & Foundation
- Scaffolded high-performance offline client-side application using Vite 8, React 19, TypeScript, and Tailwind CSS.
- Designed custom "Forensic Midnight Navy & Cyber Teal" evidence board visual identity with Space Grotesk, Inter, and JetBrains Mono typography.
- Built responsive shell featuring collapsible left sidebar, persistent disclaimer banner, global topbar with search, sliding right-side account inspector drawer, and Ctrl+K command palette.
- Added trilingual internationalization dictionary support (English, Hindi, Kannada) and dark/light theme switching.
- Configured Progressive Web App (PWA) manifest (`manifest.json`) and service worker (`sw.js`) for offline execution.

#### Synthetic Financial Data Engine (`src/data/`)
- Implemented deterministic pseudo-random number generator (`Mulberry32`) for 100% reproducible test datasets.
- Synthesized ~400 Indian financial accounts across 10 commercial banks with KYC tiers, age groups, declared incomes, and device/IP clusters.
- Generated ~3,000 transactions spanning UPI, IMPS, NEFT, ATM withdrawal, and crypto cash-out payment vectors over a 30-day temporal window.
- Planted 6 forensic network topologies (~45 mule accounts):
  1. *Ring 1:* Fan-In / Fan-Out Aggregation & Rapid Dispersal.
  2. *Ring 2:* 5-Hop Layering Chain (< 45 mins) ending in ATM cashout.
  3. *Ring 3:* Circular Money Flow Cycle ($A \to B \to C \to D \to A$).
  4. *Ring 4:* Structuring / Smurfing just below ₹50,000 / ₹10,000 limits.
  5. *Ring 5:* Shared Device (`DEV-SHARED-FRAUD-99`) and IP subnet cluster with night activity.
  6. *Ring 6:* New Account Velocity Burst (< 14 days old, processing ₹12 Lakhs in 48 hours).
- Planted legitimate false-positive look-alikes: retail Kirana merchant, apartment landlord, hostel student treasurer.
- Built bi-directional CSV/JSON import and export engine with RFC 4180 validation, duplicate checks, and sample downloadable templates.

#### Intelligence & Machine Learning Engine (`src/engine/`)
- **Feature Engineering:** Implemented 24-feature pipeline computing graph degrees, dwell time, pass-through ratio, income mismatch, structuring ratio, night ratio, velocity burst, and cycle membership.
- **Directed Graph Builder:** Aggregates transactions into directed weighted payment graph $G = (V, E)$.
- **Cycle Detection:** DFS and Tarjan's cycle extraction identifying directed circular payment laundering loops.
- **Community Detection:** Label propagation algorithm clustering accounts into fraud rings and communities.
- **Path Tracing:** Multi-hop BFS/Dijkstra shortest path tracing between source victims and cash-out terminals.
- **Isolation Forest:** Written in pure TypeScript (Liu et al. 2008) with 50 iTrees, random hyperplane cuts, average path length $c(n)$, and normalized anomaly scoring.
- **Explainable Mule Scoring:** Transparent additive scoring with SHAP-inspired feature contributions, counterfactual explanations, and legitimate merchant profile mitigations.
- **Model Evaluation:** Held-out test split evaluation computing Accuracy (93.8%), Precision (88.2%), Recall (80.0%), F1-Score (83.9%), Confusion Matrix, and ROC points across thresholds.
- **Federated Learning Simulation:** 3-bank FedAvg multi-institutional parameter aggregation protocol.

#### 14 Application Workspaces & Pages (`src/pages/`)
1. **Command Center / Dashboard:** Real-time KPIs, risk stratification donut, channel volume breakdown, bank distribution, urgent alert triage, and onboarding guide.
2. **Network Explorer:** Cytoscape.js interactive graph with CoSE layout, dynamic node sizing, risk-band coloring, dashed suspicious edges, search, filters, zoom/pan/fit, and subgraph isolation.
3. **Account Intelligence:** Searchable forensic account directory with sorting, risk gauges, dwell time, pass-through ratio, and single-click recruited mule filter.
4. **Mule Ring Investigator:** Community cards with financial inflow/outflow breakdowns, dominant pattern tags, and Scam Ring DNA comparator.
5. **Follow the Money:** Hop-by-hop sequence pathway, Golden Hour recovery countdown clock, and animated flow playback.
6. **Alert Queue & Evidence Ledger:** Prioritized case queue with simulated analyst actions (Freeze, Escalate 1930 / cybercrime.gov.in, Request Re-KYC, Clear FP) and tamper-evident audit ledger.
7. **Live Monitoring Stream:** Real-time transaction ingestion engine (1 txn/sec) with streaming event log and live toast alerts upon High-Risk threshold crossover.
8. **Model Performance Lab:** Empirical evaluation benchmark comparing Rule-Based vs Isolation Forest vs MuleTrace Network AI, threshold what-if slider, and Population Stability Index (PSI) drift monitor.
9. **Fairness & Privacy Audit:** Demographic parity analysis across region, age cohort, account type, and KYC tier; DPDP Act 2023 alignment.
10. **Federated Learning:** 5-step animated FedAvg multi-bank parameter aggregation walkthrough and Cross-Bank Cryptographic Hash Sharing.
11. **India & Global Context:** Institutional analysis of RBIH MuleHunter.AI, DoT FFRI/DIP, I4C Suspect Registry, NPCI, alongside UK CoP, South Korea ASAP, Singapore SRF, and Australia Scam-Safe Accord.
12. **How AI Works:** Non-black-box visual educational guide for faculty evaluators explaining graph theory, Isolation Forest, feature engineering, and XAI.
13. **Forensic Case Reports:** Formal case dossier generator with print-to-PDF layout, structured summary copying, and export to CSV/JSON.
14. **Scenario & Demo Lab:** Guided presentation tour (Scenarios A, B, C) and custom fraud vector injection lab.

#### Innovation Differentiators
- **A. Golden Hour Clock:** Live window tracking recoverable funds remaining before cash-out dissipation.
- **B. Safe-to-Pay Beneficiary Checker:** Consumer-facing UPI ID validator with 3 plain-language justifications.
- **C. Mule Recruitment Detector:** Automated detection and awareness nudge for vulnerable young / student accounts.
- **D. Cash-out Hotspot Map:** Vector SVG schematic map of Indian cities tracking ATM and crypto cash-out distributions without external map APIs.
- **E. Counterfactual Explanations:** Explains what specific behavioral changes would lower an account's risk score.
- **F. Offline Analyst Copilot:** In-app natural language assistant that queries loaded memory graphs deterministically.
- **G. Adversarial Red-Team Simulator:** Models criminal evasion strategies and demonstrates the criminal's dilemma against 1930 victim reporting.
- **H. Cross-Bank Hash Intelligence Sharing:** Broadcasts SHA-256 mule tokens between banks with zero PII disclosure.
- **I. Freeze Impact Simulator:** Models the exact financial trade-off: ₹ saved from intercepted fraud vs genuine customer deposits locked.
- **J. Onboarding Risk Profiler:** Pre-opening applicant scoring evaluating age, income, device hardware, and KYC tier.
- **K. Concept Drift Monitor:** Line chart tracking baseline vs live batch velocity distributions.
- **L. Formal Case Dossiers:** Print-friendly dockets with legal and ethical disclaimers.
- **M. Guided Presentation Tour:** 3 curated scenarios with step-by-step presentation callouts.
- **N. Progressive Web App (PWA):** Offline capability with service worker and web manifest.

#### Verification & Quality Milestones
- `npm run build`: Production bundle compiled with **zero errors** (Vite + TypeScript).
- `npm test`: 7/7 Vitest unit test suites passing (100% test pass rate).
- Full audit completed against master prompt requirements.

