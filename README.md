````markdown
# 🧠 SkillSync: AI Simulation Engine

> **Turn any PDF manual into an immersive, multilingual safety simulation.**

![Project Status](https://img.shields.io/badge/Status-Hackathon_Prototype-orange)
![Backend](https://colab.research.google.com/drive/1lb-Pf21lydyL3mp7JUpSu3KCpy4hhzkU?usp=sharing)
![AI](https://img.shields.io/badge/Model-ERNIE_0.3B-green)

---

## 🚨 Essential: How to Test This Project

**We use a hybrid architecture. The "Brain" (AI) lives on Google Colab, while the "Body" (Frontend) lives on Vercel.**

### 📺 1. Watch the Demo (Fastest Way)
[ **(INSERT YOUR YOUTUBE LINK HERE)** ]  
*See the cross-lingual capabilities in action without setup.*

---

### 🛠️ 2. Live Testing (Do It Yourself)

#### **Step A: Wake up the Brain (Backend)**
1. Open the **Server Notebook**:  
   [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1lb-Pf21lydyL3mp7JUpSu3KCpy4hhzkU?usp=sharing)
2. In Colab, click **Runtime → Run All** (or press `Ctrl + F9`).
3. **Wait ~2 minutes.** (The micro-model loads significantly faster than large LLMs.)
4. Scroll to the last cell and copy the **Public Ngrok URL**  
   *(e.g., `https://xxxx-xx.ngrok-free.app`)*.

#### **Step B: Connect the Body (Frontend)**
1. Open the **Live App**:  
   👉 https://frontend-inky-ten-89.vercel.app/
2. Paste the **Ngrok URL** into the **Server URL** field.
3. Upload a PDF (e.g., a safety or operations manual).
4. **Select a language** (English, Chinese, Spanish, etc.) and click **INITIALIZE**.

---

## 🏗️ Architecture & The Pivot

Due to hardware constraints on free-tier **T4 GPUs**, larger models (Qwen 7B / 21B) failed during compilation.  
We pivoted to a **Micro-Model Architecture** optimized for **speed, stability, and real-time interaction**.

### System Overview
- **Frontend (React):**
  - Cyberpunk-inspired UI
  - Scanlines, typewriter effects
  - Language-aware state management
- **Tunnel (Ngrok):**
  - Exposes ephemeral Colab backend to the public web
- **Backend (FastAPI on Colab):**
  - **LLM:** `baidu/ERNIE-4.5-0.3B` (quantized)
  - **Interceptor Middleware:** Enforces strict prompting to prevent hallucinations and apologies
  - **OCR:** PaddleOCR for scanned and low-quality industrial PDFs

---

## ✨ Key Features

- **🌍 The Babel Fish (Multilingual Support)**  
  Upload an English manual and run simulations in **Chinese, Spanish, or Bemba** with on-the-fly translation.

- **⚡ Instant Inference**  
  0.3B parameters reduce latency from ~15s to **under 2 seconds**, enabling real-time chat.

- **🛡️ Safety Net Logic**  
  A deterministic fallback generator ensures the simulation never breaks immersion if the model hesitates.

- **📄 PDF-to-Quiz Engine**  
  Automatically generates scenario-based **MCQs** from raw PDF content.

---

## 💻 Tech Stack

- **Frontend:** React.js, Axios, Lucide React  
- **Backend:** Python 3.12, FastAPI, Uvicorn  
- **AI / ML:** PyTorch, Hugging Face Transformers, PaddleOCR  
- **Infrastructure:** Google Colab, Ngrok, Vercel  

---

## 🔧 Local Development (Frontend)

```bash
# Clone the repository
git clone https://github.com/happi-web/SkillSync.git

# Enter directory
cd SkillSync

# Install dependencies
npm install

# Run locally
npm start
````

---

## 🐛 Troubleshooting

### ❌ "Server Disconnected / Idle"

* Google Colab times out after ~90 minutes.
* **Fix:** Keep the tab open. Restart the runtime and generate a new Ngrok URL if needed.

### ❌ "Model Returns Empty Response"

* The interceptor may filter overly verbose or unsafe outputs.
* **Fix:** A fallback generator injects a default scenario or question automatically.

---

### 👤 Author

**Created by Chilongo Kondwani**

