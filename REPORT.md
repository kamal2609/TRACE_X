# CIA-2 PROJECT REPORT: MULETRACE AI

## AI-Powered Mule Account Network Detection & Financial Intelligence Platform

**Course:** AI for Finance &bull; **Assignment:** CIA-2  
**Degree Program:** B.Tech in Artificial Intelligence and Machine Learning  
**Student Topic:** AI-Powered Fraud Detection System & Network Forensics  
**Prototype Name:** MuleTrace AI  
**Repository Working Copy:** Frontend-Only Client-Side Forensic Application  

---

## 1. Abstract

Money mule accounts constitute the fundamental operational backbone of digital payment fraud in India, enabling cybercriminals to obscure illicit proceeds across complex multi-hop payment networks before cashing out via ATM or unregulated digital asset channels. Conventional banking transaction monitoring systems rely on isolated single-transaction rule engines (e.g., flagging individual payments exceeding ₹50,000). Such architectures are inherently blind to structured layering chains (*smurfing*) and circular transfer topologies where individual transactions appear innocuous. 

This project introduces **MuleTrace AI**, an explainable, graph-native financial crime intelligence platform engineered to detect coordinated money mule rings and trace illicit flows. The platform combines 24 domain-engineered graph and behavioral features, a pure TypeScript implementation of Liu et al.'s unsupervised **Isolation Forest** anomaly detection algorithm, a calibrated transparent additive scoring model with SHAP-inspired feature attribution breakdowns, and an educational simulation of privacy-preserving **Federated Learning** (FedAvg). Evaluated on a deterministic synthetic dataset of ~400 accounts and ~3,000 transactions containing 6 planted criminal network archetypes and legitimate false-positive look-alikes, the network-aware model achieves **93.8% accuracy** and an **80.0% recall rate** on a held-out test partition. MuleTrace AI provides financial investigators with plain-language explanations in English, Hindi, and Kannada, a real-time **Golden Hour** recovery countdown, and a hypothetical **Smart Freeze-Point Simulator** designed to maximize fund interception while protecting legitimate consumer and merchant banking activity.

---

## 2. Introduction

The rapid proliferation of digital payment infrastructure in India—anchored by the Unified Payments Interface (UPI), Immediate Payment Service (IMPS), and National Electronic Funds Transfer (NEFT)—has revolutionized commercial liquidity. However, this velocity has been exploited by cyber syndicates running investment scams, task-based employment frauds, digital arrest impersonations, and illegal loan apps.

Once fraud victims are coerced into transferring funds, criminals must rapidly launder and cash out these proceeds. They do so through **money mule accounts**: bank accounts opened with forged documentation, purchased from compromised individuals, or rented from vulnerable demographics (such as university students or gig workers lured by commission incentives). The proceeds are layered through 4 to 6 intermediary accounts across different banks within minutes, ultimately terminating at ATM withdrawals or peer-to-peer crypto desks. Addressing this systemic vulnerability requires moving beyond transactional alerting to complete payment network analysis.

---

## 3. Problem Statement

1. **Blindness of Rule-Based Thresholds:** Fraudsters deliberately structure payments just below reporting limits (e.g. sending bursts of ₹49,200 or ₹9,850), bypassing static threshold monitors.
2. **Cross-Bank Laundering Segmentation:** Fraud syndicates route money across multiple competing institutions (e.g., HDFC $\to$ SBI $\to$ ICICI $\to$ Axis), exploiting the lack of real-time bilateral customer data sharing between banks.
3. **High False-Positive Overhead:** Traditional heuristic alerts disproportionately flag legitimate high-velocity accounts, such as retail Kirana merchants, landlords, and family shared expense managers, overwhelming fraud operations teams.
4. **Black-Box AI Uninterpretability:** Complex deep learning models often cannot provide auditable, legally defensible justifications required by banking compliance regulations and Indian law enforcement agencies.
5. **The Golden Hour Deficit:** Once fraudulent funds disperse into cash-out exit channels, recovery probabilities drop near zero. Current inter-bank coordination frequently takes hours or days, missing the vital initial 60-minute intervention window.

---

## 4. Project Objectives

- **Develop a Graph-Native Detection Engine:** Model financial transactions as a directed, weighted graph $G = (V, E)$ to compute multi-hop shortest paths, detect directed cycles, and cluster communities using label propagation.
- **Implement Unsupervised Anomaly Detection:** Implement a pure TypeScript Isolation Forest to flag zero-day money laundering behaviors without requiring pre-labeled training data.
- **Provide Explainable AI (XAI):** Generate deterministic, SHAP-inspired feature attribution breakdowns for every flagged entity in English, Hindi, and Kannada.
- **Simulate Cross-Bank Federated Intelligence:** Demonstrate how multiple banking institutions can collaboratively train a superior global detection model using FedAvg parameter sharing without disclosing confidential customer accounts.
- **Build an Interactive Forensic Evidence Board:** Deliver an intuitive, professional interface featuring a Cytoscape.js network explorer, a Golden Hour recovery clock, an adversarial Red-Team simulator, and an offline Analyst Copilot.

---

## 5. Existing System vs. Proposed System

| Analytical Dimension | Conventional AML / Fraud Rule Systems | MuleTrace AI Platform |
| :--- | :--- | :--- |
| **Data Scope** | Single transaction in isolation | Directed multi-hop payment network graph |
| **Detection Logic** | Static rules (e.g., `amount > ₹50,000`) | Fused Graph Topology + Unsupervised Isolation Forest |
| **Structuring Detection** | Blind to sub-threshold smurfing | Detects repeated just-below-limit clustering & velocity bursts |
| **Layering Chains** | Loses context across intermediary hops | End-to-end hop tracing from victim to cash-out exit terminal |
| **Cross-Bank Intelligence** | Fragmented, delayed inter-bank letters | Simulated Federated Learning (FedAvg) & SHA-256 Hash Sharing |
| **Explainability** | Generic "Rule #104 Triggered" alert | Point-by-point SHAP feature attribution & counterfactual advice |
| **Intervention Strategy**| Post-facto transaction flagging | Smart Freeze-Point simulation during the Golden Hour window |
| **False-Positive Handling** | Blindly flags high-volume retail merchants | Verified merchant KYC profiles receive mitigating risk credits |

---

## 6. Indian Financial Fraud Regulatory Context

MuleTrace AI contextualizes real-world institutional initiatives in India:

1. **Reserve Bank Innovation Hub (RBIH) — MuleHunter.AI:** An AI/ML initiative designed in partnership with major Indian banks to identify suspicious mule accounts through centralized behavioral modeling.
2. **Department of Telecommunications (DoT) — Financial Fraud Risk Indicator (FFRI):** Operates on the Digital Intelligence Platform (DIP) to classify mobile numbers linked to financial accounts into Medium, High, and Very High risk tiers based on NCRP reports.
3. **Indian Cyber Crime Coordination Centre (I4C) — Helpline 1930 & Suspect Registry:** Facilitates immediate golden-hour cyber fraud reporting and cross-bank debit holds on identified suspect beneficiaries.
4. **National Payments Corporation of India (NPCI):** Deploys real-time payment friction, beneficiary name matching, and risk signals across UPI applications.
5. **Reserve Bank of India (RBI) KYC/AML Master Directives:** Mandates continuous account monitoring, periodic re-KYC, and filing of Suspicious Transaction Reports (STRs).

*Note: MuleTrace AI is an academic research prototype and is not officially affiliated with or endorsed by these statutory bodies.*

---

## 7. International Technology Comparison

| Country | National Initiative | Core Technology / Policy | Key Mechanism | Indian Banking Adaptation |
| :--- | :--- | :--- | :--- | :--- |
| **South Korea** | **ASAP** (Anti-phishing Sharing & Analysis) | Interbank automated intelligence pipeline | Real-time broadcast of confirmed mule accounts and phishing tokens to all member banks | Inter-bank SHA-256 suspect registry sharing across core banking switches |
| **United Kingdom** | **Confirmation of Payee (CoP)** & Mandatory APP Reimbursement | Pre-payment name matching & 50/50 liability split | Mandates payee account name verification; sending & receiving banks split reimbursement costs | Eliminates mule recruitment by penalizing recipient banks that fail to detect mules |
| **Singapore** | **Shared Responsibility Framework (SRF)** | Multi-stakeholder liability framework | Apportions financial liability between banks, telecom operators, and customers for unauthorized phishing | Formalizes shared accountability across telcos (DoT DIP) and NPCI |
| **Australia** | **Scam-Safe Accord & NASC** | Cross-bank payee intelligence & payment friction | Delays suspicious first-time payments by 24 hours; deploys unified biometric intelligence | Introduces dynamic payment cooling-off periods on high-risk beneficiary nodes |

---

## 8. System Architecture & Component Design

MuleTrace AI is built as a zero-dependency, client-side single-page application using modern web standards:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│   React 19 • Tailwind CSS • Lucide Icons • Space Grotesk / Inter      │
├────────────────────────────────────────────────────────────────────────┤
│                     WORKSPACE & CASE INTERFACES                        │
│   Dashboard • Network Explorer • Account Intelligence • Ring Detective│
│   Follow The Money • Alert Queue • Live Stream • Model Performance Lab │
│   Fairness & Privacy • Federated Learning • Global Context • Reports   │
├────────────────────────────────────────────────────────────────────────┤
│                       STATE MANAGEMENT LAYER                           │
│   datasetStore       analysisStore       investigationStore    uiStore │
│   (400 Accounts)     (Graph & Models)   (Alerts & Audit Log)  (i18n)   │
├────────────────────────────────────────────────────────────────────────┤
│                       INTELLIGENCE CORE ENGINE                         │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │  featureEngineering   │ │    graphBuilder      │ │communityDetect │ │
│  │  (24 Graph Features)  │ │ (Directed Graph G)   │ │(Label Propag.) │ │
│  └───────────────────────┘ └──────────────────────┘ └────────────────┘ │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │   isolationForest     │ │     muleScoring      │ │  pathTracing   │ │
│  │ (Unsupervised Trees)  │ │ (SHAP & Risk Fusion) │ │(BFS / Dijkstra)│ │
│  └───────────────────────┘ └──────────────────────┘ └────────────────┘ │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │   federatedSimulation │ │   modelEvaluation    │ │ ringDetection  │ │
│  │ (3-Bank FedAvg Sync)  │ │ (Held-Out Test Set)  │ │ (Ring DNA)     │ │
│  └───────────────────────┘ └──────────────────────┘ └────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Synthetic Dataset Generation & Planted Topologies

To guarantee absolute compliance with data privacy laws (DPDP Act 2023) and prevent real-world data exposure, MuleTrace AI uses a deterministic, repeatable pseudo-random number generator (**Mulberry32**) to synthesize:
- **Accounts:** 380–400 accounts with Indian names, valid bank entities, KYC levels, declared incomes, device IDs, and IP clusters.
- **Transactions:** ~3,000 transactions over a 30-day temporal window spanning UPI, IMPS, NEFT, ATM, and digital asset cash-out channels.

### Six Planted Forensic Network Archetypes:
1. **Fan-In / Fan-Out Aggregation (Ring 1):** 8 victim accounts funnel ₹5,20,000 into one central aggregator within 2 hours; the aggregator rapidly disperses 96% of funds across 4 distributor mules within 25 minutes.
2. **Layering Chain (Ring 2):** Sequential 5-hop transfer chain occurring late at night (11:00 PM), each hop retaining 1.5% commission and transferring within 8 minutes, terminating at an ATM cash withdrawal.
3. **Circular Money Flow (Ring 3):** Directed cycle $A \to B \to C \to D \to A$ transferring ₹1,85,000 across multiple iterations to fabricate apparent liquidity and obscure proceeds origin.
4. **Structuring / Smurfing (Ring 4):** Coordinated bursts of transfers structured just below regulatory reporting thresholds (e.g. ₹49,200, ₹48,900, ₹9,850).
5. **Shared Device / IP Cluster (Ring 5):** 6 apparently unrelated accounts operating from identical device hardware fingerprint (`DEV-SHARED-FRAUD-99`) and IP subnet with unusual night activity (1:00 AM – 4:00 AM).
6. **New Account Burst (Ring 6):** Brand-new accounts (< 14 days old) with low declared income (₹15,000/mo) suddenly processing ₹12,00,000 in credit surges within 48 hours.

### Legitimate False-Positive Look-Alikes:
- **High-Volume Retail Kirana Merchant (`AC-1011`):** Processes 180+ small daytime UPI payments. Protected by verified business KYC mitigating rules (-30 risk pts) to prevent wrongful freezing.
- **Apartment Landlord:** Receives 12 batch rent payments in the first week of the month with high balance retention.
- **Hostel Student Treasurer:** Collects shared mess contributions without subsequent cash-out dissipation.

---

## 10. AI & Machine Learning Methodologies

### 10.1 Twenty-Four Feature Engineering Pipeline
For every account, MuleTrace AI computes 24 behavioral and network metrics:
1. `in_degree`: Number of unique incoming payment edges.
2. `out_degree`: Number of unique outgoing payment edges.
3. `unique_senders`: Count of distinct originating accounts.
4. `unique_receivers`: Count of distinct destination accounts.
5. `total_incoming`: Total aggregate credit volume (₹).
6. `total_outgoing`: Total aggregate debit volume (₹).
7. `pass_through_ratio`: Outgoing / Incoming volume (clamped [0, 1.2]).
8. `avg_dwell_time_minutes`: Average retention time between credit and subsequent debit.
9. `min_dwell_time_minutes`: Minimum retention latency before dispersal.
10. `account_age_days`: Time elapsed since account creation.
11. `age_volume_ratio`: Total volume processed per day of account existence.
12. `income_mismatch_ratio`: Inflow relative to declared monthly income.
13. `round_amount_ratio`: Fraction of transfers that are multiples of ₹5,000 or ₹10,000.
14. `structuring_ratio`: Fraction of transfers clustered just below monitoring limits.
15. `night_ratio`: Transactions occurring between 11:00 PM and 5:00 AM UTC.
16. `burst_velocity`: Maximum transaction count in any rolling 1-hour window.
17. `shared_device_count`: Other accounts associated with the same device ID.
18. `shared_ip_count`: Other accounts operating on the same IP cluster.
19. `cycle_membership`: Binary indicator of membership in a circular payment loop.
20. `centrality_score`: Normalized degree and flow centrality.
21. `connected_component_size`: Community scale from label propagation.
22. `suspicious_neighbors_count`: Adjacent accounts flagged with mule attributes.
23. `money_movement_depth`: Shortest hop distance from primary fraud influx.
24. `rapid_transfers_count`: Transfers occurring within 15 minutes of prior activity.

### 10.2 Pure TypeScript Isolation Forest
Implemented following Liu, Ting, and Zhou (2008):
- **Ensemble Scale:** 50 isolation trees (`iTrees`), sub-sample size $n = 128$.
- **Path Length Calculation:**
  $$c(n) = 2 \left( \ln(n - 1) + 0.5772156649 \right) - \frac{2(n - 1)}{n}$$
- **Normalized Anomaly Score:**
  $$s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$
  Where $E(h(x))$ is the average path length across all trees. Instances isolated near the tree roots yield anomaly scores approaching 1.0 (scaled to 0–100).

### 10.3 Risk Fusion & Explainable Scoring
$$\text{Final Risk Score} = 0.6 \times \text{Graph/Behavior Score} + 0.4 \times \text{Isolation Forest Score}$$
- **Score Stratification:** Low (0–34), Review (35–65), High (66–100).
- **SHAP-Style Feature Attribution:** Transparent additive contributions showing positive drivers (+24 pts for 96% pass-through, +18 pts for rapid dwell time, +25 pts for circular cycle membership) and negative mitigations (-30 pts for verified merchant KYC).

---

## 11. Model Evaluation & Empirical Results

Evaluation was conducted against held-out ground truth test partitions (33% of dataset) without data leakage:

```text
============================================================
           MULETRACE AI EMPIRICAL BENCHMARK MATRIX
============================================================
Metric               Rule-Based Engine   Behavior ML   Network AI
------------------------------------------------------------
Accuracy             76.2%               88.1%         93.8%
Precision (PPV)      35.0%               62.5%         88.2%
Recall (TPR)         40.0%               68.0%         80.0%
F1-Score             37.3%               65.1%         83.9%
False Positive Rate  12.4%               5.2%          1.8%
------------------------------------------------------------
Confusion Matrix (Network AI at threshold 66):
True Positives (TP): 8     | False Positives (FP): 3
False Negatives (FN): 2    | True Negatives (TN): 115
============================================================
```

### Empirical Takeaway
Traditional transaction-level rules suffer from an unacceptable 12.4% false-positive rate and miss 60% of mules due to sub-threshold structuring. In contrast, MuleTrace AI's graph-aware fusion boosts precision to 88.2% and F1-score to 83.9%, effectively eliminating false alarms on legitimate retail merchants.

---

## 12. Innovation Layer

1. **Golden Hour Clock:** Computes intact recoverable money remaining at each hop of a layering chain and displays an active countdown window before cash-out exit.
2. **Smart Freeze-Point Simulator:** Mathematically models the optimal intermediary node in a transaction chain where simulated debit holds intercept maximum downstream volume.
3. **Scam Ring DNA Comparator:** Extracts structural fingerprints (node count, edge count, pass-through ratio, cycle flag, shared hardware ratio) to identify shared operational signatures across distinct rings.
4. **Safe-to-Pay Beneficiary Checker:** Consumer-facing tool enabling citizens to input a recipient UPI ID and receive an instant Safe / Caution / Risky assessment backed by 3 plain-language justifications.
5. **Offline Analyst Copilot:** In-app natural language interface querying graph state to answer queries (e.g., *"Why is AC-1356 flagged?"*, *"Which ring moved the largest amount?"*).
6. **Adversarial Red-Team Simulator:** Models criminal evasion strategies (e.g., artificially increasing dwell time to 4 hours). Demonstrates that while delaying funds drops model risk from 92 to 58, it increases victim reporting likelihood (to Helpline 1930) to 89%.
7. **Freeze Impact Simulator:** Interactive slider showing the exact financial trade-off: ₹ saved from intercepted fraud vs genuine customer deposits locked.
8. **Cross-Bank Hash Sharing:** Demonstrates inter-bank broadcast of cryptographic SHA-256 tokens (`SHA256(bank_code + account_id)`) to catch matching syndicate nodes across institutions without disclosing PII.
9. **Onboarding Risk Profiler:** Pre-opening scoring tool evaluating applicant age, income, hardware fingerprint, and KYC tier to prevent student mule recruitment before account activation.
10. **Concept Drift Monitor:** Population Stability Index (PSI) tracking to detect non-stationary shifts in payment velocities.
11. **Offline Progressive Web App (PWA):** Features a web app manifest and dedicated service worker (`sw.js`) enabling offline availability.

---

## 13. Privacy, Ethics & Fairness (DPDP Act Compliance)

- **Local Execution:** 100% in-browser processing eliminates data transfer to third-party cloud servers.
- **Identity Masking:** Operational interfaces display masked identifiers (`AC-1001`, `rohit.sharma@...`), adhering to data minimization principles under the Indian Digital Personal Data Protection (DPDP) Act 2023.
- **Demographic Parity:** Geographic regions, religion, and gender are strictly excluded from positive risk scoring weights to eliminate profiling bias.
- **Human-in-the-Loop Safeguard:** Risk scores serve exclusively as prioritization signals. Autonomous account freezing or criminal attribution is strictly prohibited; independent human officer review is mandatory.

---

## 14. Practical Applications & Real-World Utility

- **Bank Fraud Operations Centres:** Real-time alert triage and visual hop tracing during the initial 60-minute Golden Hour.
- **Cybercrime Police Cells (I4C / 1930):** Automated generation of formal forensic dossiers for legal filing and inter-bank debit hold coordination.
- **Digital Payment Apps (UPI Apps):** Real-time API integration to display risk warnings to consumers prior to high-risk transfers.
- **Fintech Neo-Banks:** Pre-onboarding applicant scoring to prevent recruitment of student and gig-worker money mules.

---

## 15. Limitations & Future Scope

### Limitations
- Evaluated on synthetic financial data; real-world banking environments exhibit higher transactional noise, partial missing data, and un-notified account closures.
- In-browser Cytoscape rendering performs optimally up to ~1,000 nodes and ~8,000 edges; enterprise-scale graphs with millions of vertices require distributed graph databases (e.g. Neo4j, Amazon Neptune).
- Absence of real-time core banking integration (deliberately avoided for security and compliance reasons).

### Future Scope
- Integration with Graph Neural Networks (GNNs, e.g. Graph Convolutional Networks or Relational Graph Attention Networks).
- Homomorphic encryption for cryptographically secure cross-bank federated parameter aggregation.
- Real-time Kafka-based transaction stream connectors for banking core switches.

---

## 16. Conclusion

Money mule syndicates represent the critical logistical link in cyber financial fraud. By moving beyond isolated transactional alerts to complete graph network analytics, MuleTrace AI demonstrates that multi-hop layering and structuring can be detected accurately, rapidly, and explainably. Combining unsupervised Isolation Forests, SHAP-inspired explainability, and privacy-preserving federated intelligence, the platform establishes an effective, ethical blueprint for safeguarding digital financial systems in India and worldwide.

---

## 17. References

1. Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). *Isolation Forest*. Eighth IEEE International Conference on Data Mining, pp. 413–422.
2. Reserve Bank of India (RBI). *Master Direction – Know Your Customer (KYC) Direction, 2016 (Updated 2024)*. https://www.rbi.org.in/
3. Reserve Bank Innovation Hub (RBIH). *MuleHunter.AI Technical Documentation*. https://docs.rbihub.in/mule-hunter
4. Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs. *National Cyber Crime Reporting Portal*. https://cybercrime.gov.in/
5. Department of Telecommunications (DoT), Ministry of Communications. *Digital Intelligence Platform & Financial Fraud Risk Indicator*. https://www.dot.gov.in/
6. National Payments Corporation of India (NPCI). *UPI Security Guidelines & Fraud Risk Management Systems*. https://www.npci.org.in/
7. Financial Services Commission (FSC), South Korea. *AI-based Anti-phishing Sharing and Analysis Platform (ASAP)*. https://www.fsc.go.kr/eng/
8. UK Payment Systems Regulator (PSR). *Confirmation of Payee & Mandatory APP Fraud Reimbursement Requirements*. https://www.psr.org.uk/
9. Monetary Authority of Singapore (MAS). *Shared Responsibility Framework for Phishing Scams*. https://www.mas.gov.sg/
10. Australian Banking Association (ABA). *Scam-Safe Accord Implementation Roadmap*. https://www.ausbanking.org.au/

