from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from paddleocr import PaddleOCR
from huggingface_hub import InferenceClient
import erniebot
import pdfplumber

import shutil
import os
import logging
import base64
import io
import re

from dotenv import load_dotenv

# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

AI_STUDIO_TOKEN = os.getenv("AI_STUDIO_TOKEN")
HF_TOKEN = os.getenv("HF_TOKEN")

if not AI_STUDIO_TOKEN:
    raise RuntimeError("AI_STUDIO_TOKEN is not set")

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN is not set")

# ==========================================
# CONFIGURATION
# ==========================================

# --- ERNIE (Chat / Simulation) ---
erniebot.api_type = "aistudio"
erniebot.access_token = AI_STUDIO_TOKEN

# --- HUGGING FACE (Image Generation) ---
hf_client = InferenceClient(token=HF_TOKEN)

# --- OCR ---
logging.getLogger("ppocr").setLevel(logging.ERROR)
ocr = PaddleOCR(use_angle_cls=False, lang="en")

# ==========================================
# APP SETUP
# ==========================================

app = FastAPI(title="SkillSync AI Simulation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# GLOBAL CONTEXT (IN-MEMORY SESSION)
# ==========================================

global_context = {
    "manual_text": "",
    "history": [],
    "topic": "General Science",
}

# ==========================================
# REQUEST MODELS
# ==========================================

class SimRequest(BaseModel):
    action: str
    language: str = "English"


class ImageGenRequest(BaseModel):
    prompt: str

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def extract_text_from_file(file_path: str, filename: str) -> str:
    text = ""
    is_pdf = filename.lower().endswith(".pdf")

    if is_pdf:
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages[:10]:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            print(f"[READ] PDF Error: {e}")

    if len(text) < 50:
        try:
            result = ocr.ocr(file_path, cls=False)
            if result and result[0]:
                text += "\n".join(line[1][0] for line in result[0])
        except Exception as e:
            print(f"[OCR] Error: {e}")

    return text


def extract_visual_concept(scenario_text: str) -> str:
    try:
        prompt = f"""
Extract the single most important physical object or setting
for a technical diagram. Return ONLY the noun.

TEXT:
{scenario_text[-500:]}
"""
        response = erniebot.ChatCompletion.create(
            model="ernie-3.5",
            messages=[{"role": "user", "content": prompt}],
        )
        return response.get_result().strip()
    except Exception:
        return "Technical Schematic"

# ==========================================
# ENDPOINTS
# ==========================================

@app.post("/upload")
async def upload_manual(file: UploadFile = File(...)):
    temp_filename = f"temp_{file.filename}"

    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_file(temp_filename, file.filename)

    if os.path.exists(temp_filename):
        os.remove(temp_filename)

    if len(extracted_text) < 20:
        extracted_text = "WARNING: The uploaded document was empty or unreadable."

    global_context["manual_text"] = extracted_text
    global_context["history"] = []
    global_context["topic"] = (
        file.filename.replace(".pdf", "").replace("_", " ")
    )

    print(f"[UPLOAD] ✅ Success. Topic set to: {global_context['topic']}")

    return {
        "status": "success",
        "char_count": len(extracted_text),
    }


@app.post("/simulate")
async def run_simulation(request: SimRequest):
    manual = global_context.get("manual_text", "")

    if not manual or len(manual) < 50:
        return {"response": "SYSTEM ERROR: No manual loaded."}

    global_context["history"].append(f"User: {request.action}")
    conversation_log = "\n".join(global_context["history"][-4:])

    prompt = f"""
ROLE: Expert Simulator.

MANUAL:
{manual[:4000]}

INSTRUCTIONS:
- Language: {request.language}
- Create scenario + 3 options (A, B, C)
- MUST include image tag if physical concept exists

[Image of Object Name]

CHAT HISTORY:
{conversation_log}
"""

    try:
        response = erniebot.ChatCompletion.create(
            model="ernie-3.5",
            messages=[{"role": "user", "content": prompt}],
        )

        ai_reply = response.get_result()

        if (
            "[Image of" not in ai_reply
            and "START SIMULATION" not in request.action
        ):
            visual = extract_visual_concept(ai_reply)
            if visual:
                ai_reply += f"\n\n[Image of {visual}]\n"

        global_context["history"].append(f"AI: {ai_reply}")
        return {"response": ai_reply}

    except Exception as e:
        return {"response": f"System Error: {str(e)}"}


@app.post("/generate_image")
async def generate_image_endpoint(req: ImageGenRequest):
    prompt_content = req.prompt
    context_topic = global_context.get("topic", "")

    full_prompt = (
        "Technical schematic drawing of "
        f"{prompt_content} in context of {context_topic}, "
        "white lines on blue background, blueprint style, high definition"
    )

    print(f"\n🎨 [IMAGE REQUEST] Prompt: '{full_prompt}'")

    try:
        print("   👉 Attempting Hugging Face (SDXL)...")

        image = hf_client.text_to_image(
            model="stabilityai/stable-diffusion-xl-base-1.0",
            prompt=full_prompt,
        )

        buffered = io.BytesIO()
        image.save(buffered, format="PNG")

        img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        img_url = f"data:image/png;base64,{img_base64}"

        print("   ✅ [IMAGE GEN] VIA HUGGING FACE (Success)")
        return {"image": img_url}

    except Exception as e:
        print(f"   ⚠️ Hugging Face Failed: {e}")
        print("   👉 Switching to Pollinations.ai...")

        safe_prompt = full_prompt.replace(" ", "%20")
        fallback_url = (
            "https://image.pollinations.ai/prompt/"
            f"{safe_prompt}?width=512&height=512&model=flux&nologo=true"
        )

        print("   ✅ [IMAGE GEN] VIA FALLBACK (Pollinations)")
        return {"image": fallback_url}
