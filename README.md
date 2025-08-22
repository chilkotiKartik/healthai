# 🧠 HealthAi — AI-Powered Healthcare with Blockchain-Inspired Privacy

> **Next-gen healthcare platform** combining **AI, blockchain-style security, VR, and family support** to deliver **proactive, empathetic, and intelligent mental health care.**

---

## ✨ Key Highlights

* **Anonymous Unique IDs**: No personal names stored (e.g., `P-AX23FQ`, `D-XY98LM`).
* **AI Mood Graphs** + Forecasts → real-time health tracking.
* **AI Alert Chain** → auto-escalation from Patient → Family → Doctor → Emergency.
* **Appointment Booking** with **time-locked unique codes**.
* **VR Consultation Placeholder** (room via appointment code).
* **Support Circle (Family Dashboard)** with **AI coaching & conversation prompts**.
* **Health Tokens & Gamification** (rewards, streaks, digital badges).
* **AI Digital Twin Simulation** (predictive health outcomes).
* **Global Health Passport** (expiring, anonymized health share).
* **Blockchain-style Access Logs** (every access is transparent & immutable).

---

## 🏗 Architecture

```
Frontend (Next.js + Tailwind + shadcn/ui + Recharts + Framer Motion)
   ↕ REST APIs (JWT-secured)
Backend (Node.js / Express)
   ├─ MongoDB (patients, doctors, families, appointments, tokens)
   ├─ AI Engine (mood analysis, forecasting, journaling, recommendations)
   ├─ VR/Video Placeholder (room via appointment code)
   └─ Blockchain-style Access Logs (who, when, what)
```

---

## 🚀 Feature Walkthrough

### 1. Patient Dashboard

* Daily **Mood Tracking** & **AI-analyzed journals**.
* **Mood Graph with AI Forecast** (7-day prediction line).
* **Appointment booking** with time-locked unique codes.
* **Join VR Consult** using secure appointment code.
* **Token wallet**: earn for streaks, therapy, journaling.
* **Health Passport**: generate expiring, shareable health summary.

### 2. Doctor Dashboard

* View **assigned/consented patients**.
* Access **AI Wellness Index** (0-100 score per patient).
* Get **AI risk alerts** & escalation logs.
* Verify appointments with unique codes.
* Join VR consults & document care.

### 3. Family Dashboard (Support Circle)

* See **consented patient overview** (mood graph, milestones).
* Receive **AI prompts** for supportive communication.
* Send **bonus tokens** for encouragement.
* Celebrate **streaks & progress milestones**.
* Optional video check-in (logged on blockchain-style ledger).

### 4. Health AI Suite 🧠

* **AI Mood Graph & Forecast** → future trajectory prediction.
* **Emotion-Aware Journaling** → auto sentiment analysis.
* **Smart Escalation AI** → alert chain up to emergency.
* **AI Digital Twin** → “what-if” health outcome simulations.
* **AI Therapy Copilot** → personalized micro-actions.
* **Conversational AI Support** → empathetic chatbot.
* **Wellness Index Score** → quick triage for doctors.
* **Family AI Coach** → AI-suggested conversation prompts.
* **AI Health Passport** → anonymized summary for cross-border care.
* **Crisis AI** → detects critical risks & simulates emergency response.

---

## 🧰 Tech Stack

* **Frontend**: Next.js, TailwindCSS, shadcn/ui, Recharts, Framer Motion
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **Auth**: JWT (role-based access)
* **AI Services**: Sentiment Analysis, Forecasting Models
* **VR/Video**: WebRTC placeholder (room = appointment code)
* **Blockchain-style Logging**: Immutable access trail

---

## ⚡ Quick Start

1. **Clone & Install**

   ```bash
   git clone <your-repo-url>
   cd medblockcare-x
   npm install
   ```

2. **Create `.env` File**

   ```env
   API_PORT=4000
   MONGO_URI=mongodb://127.0.0.1:27017/medblockcare
   JWT_SECRET=supersecret
   NEXT_PUBLIC_API_BASE=http://localhost:4000
   ```

3. **Run in Dev Mode**

   ```bash
   npm run dev
   # Frontend: http://localhost:3000
   # Backend : http://localhost:4000
   ```

---

## 📦 NPM Scripts

* `npm run dev` — start API + Web together
* `npm run dev:web` — run frontend only
* `npm run dev:api` — run backend only
* `npm run build` — build both
* `npm run start` — run production

---

## 🔒 Security & Privacy

* All accounts linked to **anonymous unique IDs** (not names).
* Access is **role & consent-based**.
* Every access/action logged in **immutable ledger**.
* Appointment codes are **time-locked** and **auto-expire**.

---

## 🌍 Roadmap

* ✅ AI sentiment + forecast integration
* ✅ Gamification (tokens, streaks, milestones)
* ✅ Support Circle + AI coach
* 🔜 IoT integration (wearables for heart-rate, sleep, stress data)
* 🔜 On-chain NFT health passports
* 🔜 AI-powered VR therapy sessions

---

## 📜 License

Licensed under the **Apache 2.0 License**.
