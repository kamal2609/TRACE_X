# 5-MINUTE VIVA & PRESENTATION DEMO SCRIPT

## MuleTrace AI: AI-Powered Mule Account Network Detection

**Presenter Role:** Lead AI/Fintech Architect & Financial Crime Investigator  
**Audience:** Faculty Evaluator, CIA-2 Review Committee, Fintech Examiners  
**Total Duration:** 5 Minutes (Strictly Timed)  
**Preparation:** Open `http://localhost:5173/` in Google Chrome / Edge.

---

### Phase 1: Problem Introduction & Command Center Overview (0:00 – 0:45)
**Click Path:** Start on **Command Center / Dashboard** (`/`).

**Talking Points:**
> "Good morning, evaluators. In India's fast payment ecosystem, cyber financial fraud relies on money mule accounts to layer and cash out scam proceeds. Traditional bank fraud monitoring looks at single transactions in isolation—for example, flagging payments above ₹50,000. Fraud syndicates bypass this through structuring, splitting ₹5 Lakhs into ten ₹49,200 transfers. 
> 
> MuleTrace AI solves this by analyzing the entire transaction network. On our Command Center, you can see that the system has ingested ~400 accounts and ~3,000 transactions across 10 Indian scheduled commercial banks. It immediately identifies ₹38.2 Lakhs in suspected exposure and isolates ₹26.0 Lakhs in potentially interceptable funds before exit cash-out."

**Actions to Demonstrate:**
- Point to the **4 KPI cards** (Scanned Accounts, Flagged Mules, Detected Rings, Potentially Interceptable Amount).
- Click the **"Run AI Analysis"** button in the topbar; observe the instant micro-recalibration of all risk scores.

---

### Phase 2: Interactive Network Explorer & Account Deep-Dive (0:45 – 1:45)
**Click Path:** Click **"Network Explorer"** in the sidebar.

**Talking Points:**
> "Let's open the Network Explorer. Here, accounts are vertices and payments are directed weighted edges. Cytoscape.js renders the full topology with node sizes proportional to transaction volume and colors mapped to AI risk bands: Crimson for High Risk, Amber for Review, and Emerald for Low Risk.
> 
> Notice this dense cluster: this is Ring 1, a Fan-In / Fan-Out aggregator ring. When I click on central node AC-1356, the sliding forensic drawer opens on the right. 
> 
> MuleTrace AI provides full explainability. Our SHAP-inspired feature attribution shows why AC-1356 is flagged: it has a 96% pass-through ratio (+24 pts), rapid outflow dwell time under 10 minutes (+18 pts), and incoming credits 8x higher than its declared monthly income. Crucially, the system also provides counterfactual advice: what would lower this score."

**Actions to Demonstrate:**
- Use the **Ring dropdown** to isolate `RING-01`.
- Click node `AC-1356` to open the **Right-Side Account Drawer**.
- Scroll through the **SHAP attribution bars**, the **Mule Recruitment warning banner**, and click **"Simulate Freeze"** to log an intervention.

---

### Phase 3: Follow the Money & Golden Hour Clock (1:45 – 2:30)
**Click Path:** Click **"Follow the Money"** in the sidebar.

**Talking Points:**
> "Now let's trace money movement from victim to cash-out. I'll click 'Load Ring 2 Layering Path'. 
> 
> The system computes a 5-hop directed path starting from the victim's NEFT deposit at 11:00 PM, passing through 4 intermediary mules, and terminating at an ATM cash withdrawal.
> 
> Here are two key innovations:
> First, the Golden Hour Clock displays how much time remains before funds dissipate and calculates that ₹3,15,000 is still recoverable at the current hop.
> Second, our Smart Freeze-Point Simulator automatically identifies the optimal intermediary node (Hop 2) where simulated intervention halts maximum downstream flow before cashout."

**Actions to Demonstrate:**
- Click **"Load Ring 2 Layering Path"**.
- Click **"Play Flow"** to demonstrate animated step-by-step money movement.
- Point to the **Golden Hour Countdown** and **Smart Freeze-Point Assessment** card.

---

### Phase 4: Model Performance Lab & Empirical Verification (2:30 – 3:30)
**Click Path:** Click **"Model Performance Lab"** in the sidebar.

**Talking Points:**
> "Let's examine our AI/ML model performance. All metrics displayed here are genuinely computed from held-out test splits without data leakage.
> 
> We compare three architectures:
> 1. Single-Transaction Rules: High false positives (12.4%) and poor recall (40%).
> 2. Isolation Forest Alone: Decent anomaly detection, but lacks network context (F1: 65%).
> 3. MuleTrace Fused Network AI: Combines graph topology with the Isolation Forest to achieve 93.8% accuracy, 88.2% precision, and an 83.9% F1-score.
> 
> Using this interactive threshold slider, an investigator can test the trade-off between aggressive recall and conservative zero-false-positive operation."

**Actions to Demonstrate:**
- Drag the **High Risk Cutoff Threshold** slider from 66 to 75 and observe the live recalculation of the confusion matrix.
- Point to the **Concept Drift Monitor** tracking Population Stability Index (PSI = 0.042).

---

### Phase 5: Privacy-Preserving Federated Learning & Conclusion (3:30 – 5:00)
**Click Path:** Click **"Federated Learning"** in the sidebar.

**Talking Points:**
> "Fraudsters route money across competing institutions knowing banks cannot share confidential customer data under India's DPDP Act. 
> 
> In this simulation, three virtual institutions—HDFC, SBI, and ICICI—train local models on their own private servers. Through simulated FedAvg parameter aggregation, they share only mathematical gradient weights. The resulting global model achieves 96% precision and 95% recall—vastly outperforming any single bank working alone.
> 
> Finally, our Cross-Bank Hash Sharing module demonstrates how banks can broadcast SHA-256 tokens of confirmed mules, enabling peer banks to intercept matching syndicates with zero customer data leakage.
> 
> In conclusion, MuleTrace AI bridges cutting-edge graph analytics, unsupervised machine learning, and ethical explainability to protect India's digital payment infrastructure. Thank you. I welcome your questions."

**Actions to Demonstrate:**
- Click **"Execute Step"** to advance the animated FedAvg aggregation cycle.
- Click **"Broadcast Cryptographic Mule Hash"** at the bottom to demonstrate inter-bank hash interception.
- Conclude presentation.

