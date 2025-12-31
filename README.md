# 🧠 SkillSync: AI Simulation Engine

> **Turn any PDF manual into an immersive, multilingual safety simulation.**

---

## 🚨 Essential: How to Test This Project

SkillSync uses a **hybrid architecture**: the "Brain" (AI) runs on a GPU-enabled Google Colab instance, while the "Body" (Frontend) is hosted on Vercel.

### 📺 1. Watch the Demo (Fastest Way)

[ **(INSERT YOUR YOUTUBE LINK HERE)** ]

*See the cross-lingual capabilities and real-time inference in action without setup.*

---

### 🛠️ 2. Live Testing (Do It Yourself)

#### **Step A: Wake up the Brain (Backend)**

1. **Open the Server Notebook**:
2. In Colab, click **Runtime → Run All** (or press `Ctrl + F9`).
3. **Wait ~2 minutes** while the environment initializes and the micro-model loads.
4. Scroll to the last cell and copy the **Public Ngrok URL** *(e.g., `https://xxxx-xx.ngrok-free.app`)*.

#### **Step B: Connect the Body (Frontend)**

1. **Open the Live App**:
👉 [https://frontend-inky-ten-89.vercel.app/](https://frontend-inky-ten-89.vercel.app/)
2. Paste your **Ngrok URL** into the **Server URL** field in the UI.
3. Upload a PDF (e.g., a safety or operations manual).
4. **Select a language** (English, Chinese, Spanish, etc.) and click **INITIALIZE**.

---

## 🏗️ Architecture & Technical Pivot

To ensure stability on free-tier **T4 GPUs**, we pivoted from larger models (Qwen 7B) to a **Micro-Model Architecture**. This choice prioritizes low latency and high reliability in resource-constrained environments.

### System Overview

* **Frontend (React):** A Cyberpunk-inspired UI featuring scanlines, typewriter effects, and language-aware state management.
* **Tunnel (Ngrok):** Securely exposes the ephemeral Colab backend to the public web.
* **Backend (FastAPI):**
* **LLM:** `baidu/ERNIE-4.5-0.3B` (quantized) for rapid text generation.
* **Interceptor Middleware:** Custom logic to enforce strict prompting and prevent model hallucinations.
* **OCR:** Integrated **PaddleOCR** to handle scanned or low-quality industrial PDFs.



---

## ✨ Key Features

* **🌍 The Babel Fish (Multilingual Support)** Upload an English manual and run simulations in **Chinese, Spanish, or Bemba** with on-the-fly translation.
* **⚡ Instant Inference** The 0.3B parameter model reduces latency from ~15s to **under 2 seconds**, enabling a natural conversation flow.
* **🛡️ Safety Net Logic** A deterministic fallback generator ensures the simulation never breaks immersion if the AI model hesitates or hits a safety filter.
* **📄 PDF-to-Quiz Engine** Automatically extracts logic from raw PDF content to generate scenario-based **Multiple Choice Questions (MCQs)**.

---

## 💻 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React.js, Axios, Lucide React, Tailwind CSS |
| **Backend** | Python 3.12, FastAPI, Uvicorn |
| **AI / ML** | PyTorch, Hugging Face Transformers, PaddleOCR |
| **Infrastructure** | Google Colab (T4 GPU), Ngrok, Vercel |

---

## 🔧 Local Development (Frontend)

If you wish to run the frontend locally:

```bash
# Clone the repository
git clone https://github.com/happi-web/SkillSync.git

# Enter directory
cd SkillSync

# Install dependencies
npm install

# Run locally
npm start

```

---

## 🐛 Troubleshooting

### ❌ "Server Disconnected / Idle"

* **Cause:** Google Colab times out after periods of inactivity.
* **Fix:** Keep the Colab tab active. If it disconnects, restart the runtime and update the Ngrok URL in the frontend.

### ❌ "Model Returns Empty Response"

* **Cause:** The interceptor may filter outputs that don't match the strict simulation format.
* **Fix:** The "Safety Net" should automatically inject a fallback question. If it persists, try re-initializing with a clearer PDF.

---

### 👤 Author

**Created by Chilongo Kondwani** *Developed for the [Insert Hackathon Name] Challenge.*

---

**Would you like me to generate a `LICENSE` file or a `CONTRIBUTING.md` guide to go along with this?**
