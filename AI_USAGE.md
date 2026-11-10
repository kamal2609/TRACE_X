# AI USAGE DISCLOSURE & DEVELOPMENT METHODOLOGY

**Project:** MuleTrace AI — AI-Powered Mule Account Network Detector  
**Course:** AI for Finance (CIA-2 Assignment)  
**Program:** B.Tech in Artificial Intelligence & Machine Learning  

---

## 1. Transparency Overview

In compliance with academic integrity guidelines, this document outlines how Artificial Intelligence and large language model (LLM) tools were utilized during the design, development, and testing of MuleTrace AI.

MuleTrace AI was developed through an agentic pair-programming workflow. A strict distinction is maintained between:
1. **AI Development Assistance:** AI tools used to assist with architecture ideation, boilerplate code generation, UI layout scaffolding, and test generation.
2. **Runtime Algorithmic Implementation:** The actual algorithms executed inside the application (e.g., pure TypeScript Isolation Forest, Cytoscape directed graph traversals, FedAvg parameter aggregation, SHAP feature attribution), which execute deterministically in the client browser without external generative AI APIs.

---

## 2. Breakdown of AI Assistance by Project Phase

| Phase | AI Tool Role | Human / Student Engineering Ownership |
| :--- | :--- | :--- |
| **1. Requirements & System Design** | Assisted in structuring regulatory benchmarks (RBI MuleHunter.AI, DoT FFRI, South Korea ASAP, UK CoP) into a comprehensive technical requirement matrix. | Defined project objectives, problem statement, technology stack restrictions (offline frontend-only, zero backend), and ethical boundaries. |
| **2. Synthetic Financial Data Architecture** | Assisted in authoring deterministic Mulberry32 PRNG logic and seeding realistic Indian demographic distributions. | Designed the 6 specific fraud ring topologies (Fan-In/Out, Layering Chain, Circular Cycles, Structuring, Shared Device, Burst) and legitimate look-alike false-positive cases. |
| **3. Machine Learning & Graph Algorithms** | Assisted in translating Liu et al. (2008) Isolation Forest mathematical path length formulas into pure TypeScript data structures. | Implemented and verified recursive tree splitting, subsampling bounds, average path length $c(n)$, and additive feature attribution scoring. |
| **4. User Interface & Frontend Components** | Scaffolding Tailwind CSS component layouts, Recharts chart configurations, and Cytoscape.js canvas options. | Designed the cohesive "Forensic Midnight Navy & Cyber Teal" evidence board design system, sliding detail drawer, command palette, and interactive controls. |
| **5. Testing & Debugging** | Generated unit test cases in Vitest covering synthetic generation, graph builder, cycle detection, path tracing, and model evaluation. | Debugged compilation issues (peer dependencies, JSX escaping, Cytoscape CSS styles), verified zero-error builds, and validated empirical evaluation metrics. |
| **6. Academic Documentation** | Assisted in formatting the 23-section CIA-2 academic report, README, and timed 5-minute presentation script. | Conducted literature review, authored technical explanations, verified empirical test metrics, and framed regulatory implications. |

---

## 3. Runtime Algorithm Verification (No External Generative AI at Runtime)

The application operates **100% offline without external generative AI or cloud APIs**:
- **Graph Analytics:** Pure deterministic graph algorithms (Depth-First Search cycle detection, Breadth-First Search pathfinder, Label Propagation community clustering).
- **Isolation Forest:** Written from scratch in pure TypeScript (`src/engine/isolationForest.ts`) using recursive binary tree structures.
- **Explainable AI (XAI):** SHAP-inspired feature contributions are calculated directly from feature deviations against baseline population medians.
- **Analyst Copilot:** Implemented using offline intent matching against the in-memory graph state (`src/components/investigation/CopilotModal.tsx`), ensuring zero hallucinations or external API calls.

---

## 4. Development Activity Log

- **Nov 10, 2026 — 17:15 to 17:35:** Project directory inspection; established 9-phase implementation plan; scaffolded Vite + React 19 + TypeScript + Tailwind CSS foundation.
- **Nov 10, 2026 — 17:35 to 17:45:** Implemented seeded synthetic data generator (`Mulberry32`), planting 6 mule networks (~45 mules) and false-positive look-alikes across ~400 accounts and ~3,000 transactions.
- **Nov 10, 2026 — 17:45 to 18:00:** Implemented core intelligence engine in `src/engine/`: 24-feature pipeline, Cytoscape graph builder, cycle detection, label propagation community detection, pure TypeScript Isolation Forest, and SHAP-style scoring.
- **Nov 10, 2026 — 18:00 to 18:15:** Wrote and verified 7 Vitest unit tests; achieved 100% test passing status.
- **Nov 10, 2026 — 18:15 to 18:45:** Built all 14 domain-specific workspaces and 10 innovation features (Golden Hour Clock, Safe-to-Pay, Red-Team Simulator, Freeze Impact Simulator, Cross-Bank Hash Sharing, PWA).
- **Nov 10, 2026 — 23:05 to 23:15:** Successfully executed `npm run build` (zero errors) and `npm test` (7/7 passing tests); completed academic documentation (`REPORT.md`, `DEMO_SCRIPT.md`, `AI_USAGE.md`, `CHANGELOG.md`).

