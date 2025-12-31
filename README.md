```markdown
# 🧠 SkillSync: AI Simulation Engine

> **Turn any PDF manual into an immersive, multilingual safety simulation.**

![Project Status](https://img.shields.io/badge/Status-Hackathon_Prototype-orange) ![Backend](https://img.shields.io/badge/Backend-Google_Colab_T4-blue) ![AI](https://img.shields.io/badge/Model-ERNIE_0.3B-green)

## 🚨 Essential: How to Test This Project
**We use a hybrid architecture. The "Brain" (AI) lives on Google Colab, while the "Body" (Frontend) lives on Vercel.**

### 📺 1. Watch the Demo (Fastest Way)
[ **(INSERT YOUR YOUTUBE LINK HERE)** ]
*See the Cross-Lingual capabilities in action without setup.*

---

### 🛠️ 2. Live Testing (Do It Yourself)

#### **Step A: Wake up the Brain (Backend)**
1. Open the **Server Notebook**: [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1lb-Pf21lydyL3mp7JUpSu3KCpy4hhzkU?usp=sharing)
2. In Colab, click **Runtime > Run All** (or press `Ctrl+F9`).
3. **Wait ~2 minutes.** (We optimized the model to load instantly compared to larger LLMs).
4. Scroll to the bottom of the last cell and copy the **Public URL** (e.g., `https://xxxx-xx.ngrok-free.app`).

#### **Step B: Connect the Body (Frontend)**
1. Go to the **Live App**: [ **https://frontend-inky-ten-89.vercel.app/** ]
2. Paste the **Ngrok URL** from Step A into the "Server URL" box in the settings/header.
3. Upload a PDF (e.g., a Safety Manual).
4. **Select a Language** (English, Chinese, Spanish, etc.) and click **INITIALIZE**.

---

## 🏗️ Architecture & The Pivot
We faced significant hardware constraints (Free Tier T4 GPUs) that caused larger models (Qwen 7B/21B) to crash during compilation. We pivoted to a **Micro-Model Architecture** optimized for speed and stability.



* **Frontend (React):** "Cyberpunk" UI with scanlines, typewriter effects, and language state management.
* **Tunnel (Ngrok):** Bridges the ephemeral Colab environment to the Vercel frontend.
* **Backend (FastAPI on Colab):**
    * **LLM:** `baidu/ERNIE-4.5-0.3B` (Quantized). We chose this for its stability and speed on low-VRAM environments.
    * **Logic Layer:** Custom "Interceptor" middleware that prevents model hallucinations/apologies by injecting strict prompting protocols.
    * **OCR:** PaddleOCR for robust text extraction from scanned industrial documents.

## ✨ Key Features
* **🌍 The Babel Fish (Multilingual Support):** Upload an English manual, but run the simulation in **Chinese, Spanish, or Bemba**. The system translates safety protocols on the fly.
* **⚡ Instant Inference:** By using a 0.3B parameter model, we reduced latency from ~15s to **<2s**, enabling real-time chat.
* **🛡️ "Safety Net" Logic:** The backend includes a failsafe generator. If the model hesitates, a hardcoded logic layer ensures the simulation continues without breaking immersion.
* **📄 PDF-to-Quiz:** Automatically generates scenario-based Multiple Choice Questions (MCQs) from raw PDF text.

## 💻 Tech Stack
* **Frontend:** React.js, Axios, Lucide React (Icons).
* **Backend:** Python 3.12, FastAPI, Uvicorn.
* **AI/ML:** PyTorch, Transformers (Hugging Face), PaddleOCR.
* **Infrastructure:** Google Colab (Compute), Ngrok (Tunneling), Vercel (Hosting).

## 🔧 Local Development
If you want to modify the frontend code:

```bash
# Clone the repository
git clone [https://github.com/happi-web/SkillSync.git](https://github.com/happi-web/SkillSync.git)

# Enter directory
cd SkillSync

# Install dependencies
npm install

# Run locally
npm start

```

## 🐛 Troubleshooting

**"Server Disconnected / Idle"**

* Google Colab times out after 90 minutes.
* **Fix:** Keep the browser tab open. If the URL stops working, restart the Colab Runtime and get a new Ngrok URL.

**"Model Returns Empty Response"**

* This happens if the "Safety Net" logic is too aggressive.
* **Fix:** We implemented a fallback generator in the backend that injects a default question if the LLM output is filtered out.

---

*Created by Chilongo Kondwani*

```