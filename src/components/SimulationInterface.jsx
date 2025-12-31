import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Terminal, Play, ShieldCheck, AlertTriangle, 
  RefreshCw, Send, Volume2, VolumeX, Globe // <--- Added Globe Icon
} from 'lucide-react';
import './SimulationInterface.css';

// 🔴 CHECK YOUR NGROK URL
const API_URL = "https://overblindly-autophytic-donetta.ngrok-free.dev";

const SimulationInterface = () => {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('IDLE');
  const [fullScenarioText, setFullScenarioText] = useState("System Ready. Select Language Protocol...");
  const [displayedText, setDisplayedText] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  
  // 🌍 NEW: Language State
  const [language, setLanguage] = useState("English");

  const messagesEndRef = useRef(null);
  const typewriterRef = useRef(null);

  // --- TYPEWRITER & TTS (Same as before) ---
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    if (typewriterRef.current) clearInterval(typewriterRef.current);

    typewriterRef.current = setInterval(() => {
      if (i < fullScenarioText.length) {
        setDisplayedText((prev) => prev + fullScenarioText.charAt(i));
        i++;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        clearInterval(typewriterRef.current);
      }
    }, 20);

    if (soundOn && !fullScenarioText.includes("System Ready")) {
      window.speechSynthesis.cancel();
      // Attempt to match voice to language (Basic support)
      const utterance = new SpeechSynthesisUtterance(fullScenarioText);
      utterance.lang = language === "Chinese" ? "zh-CN" : 
                       language === "Spanish" ? "es-ES" : "en-US";
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    return () => clearInterval(typewriterRef.current);
  }, [fullScenarioText, soundOn, language]);

  const sendMove = async (action) => {
    if (!action.trim()) return;
    setLoading(true);
    window.speechSynthesis.cancel();

    const newHistory = [...history, { role: "user", content: action }];
    setHistory(newHistory);
    
    try {
      // 🌍 SEND LANGUAGE TO BACKEND
      const res = await axios.post(`${API_URL}/simulate`, { 
        action, 
        history: newHistory,
        language: language 
      });

      let rawText = res.data.response;
      rawText = rawText.replace(/Trainer:/gi, "").trim();

      // Status Logic
      let newStatus = status;
      if (rawText.toLowerCase().includes("fail") || rawText.includes("❌")) newStatus = "CRITICAL";
      else if (rawText.toLowerCase().includes("correct") || rawText.includes("✅")) newStatus = "SAFE";
      else newStatus = "ACTIVE";

      setStatus(newStatus);
      setFullScenarioText(rawText);

    } catch (err) {
      setFullScenarioText("⚠️ CONNECTION ERROR: SkillSync Offline.");
    }

    setInput("");
    setLoading(false);
  };

  const statusIcon =
    status === "CRITICAL" ? <AlertTriangle className="blink" /> :
    status === "SAFE" ? <ShieldCheck className="pulse" /> :
    <Terminal />;

  return (
    <div className="sim-root">
      <div className="scanlines"></div>

      {/* HEADER */}
      <div className={`sim-hud ${status.toLowerCase()}`}>
        <div className="hud-left">
          <div className="hud-icon">{statusIcon}</div>
          <div>
            <h2 className="glitch">SKILLSYNC_OS</h2>
            <span className="subtitle">v3.0 • MULTILINGUAL CORE • ONLINE</span>
          </div>
        </div>
        
        {/* 🌍 LANGUAGE SELECTOR */}
        <div className="hud-right" style={{display:'flex', gap:'15px', alignItems:'center'}}>
          <div className="lang-select">
            <Globe size={16} color="#00ff41"/>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="English">ENGLISH</option>
              <option value="Chinese">CHINESE (中文)</option>
              <option value="Spanish">SPANISH (Español)</option>
              <option value="French">FRENCH (Français)</option>
              <option value="Bemba">BEMBA (Zambia)</option>
            </select>
          </div>
          
          <button onClick={() => setSoundOn(!soundOn)} className="icon-btn">
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="sim-main">
        <div className="history-preview">
          {history.slice(-3).map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              <span className="role-tag">{msg.role === "user" ? "USER >" : "SYS >"}</span>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="scenario-box">
          {loading ? (
            <div className="loading">
              <RefreshCw className="spin" /> TRANSLATING PROTOCOLS...
            </div>
          ) : (
            <p className="scenario-text">
              {displayedText}<span className="cursor">█</span>
            </p>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* CONTROLS */}
      <div className="sim-controls">
        {history.length === 0 ? (
          <button className="start-btn" onClick={() => sendMove("START SIMULATION")}>
            <Play /> INITIALIZE ({language.toUpperCase()})
          </button>
        ) : (
          <div className="input-row">
            <span className="prompt-arrow">{">"}</span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMove(input)}
              placeholder={`Enter command in ${language}...`}
              disabled={loading}
              autoFocus
            />
            <button onClick={() => sendMove(input)} disabled={loading} className="send-btn">
              EXECUTE <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationInterface;