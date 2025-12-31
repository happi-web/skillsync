import React, { useState } from 'react';
import SimulationInterface from './components/SimulationInterface';
import { uploadPDF } from './api';
import './App.css';

function App() {
  const [phase, setPhase] = useState('upload'); // upload | training | ready | simulation
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState(null);

  const handleFileUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadPDF(file);
      setFileId(res.file_id);

      setPhase('training');
      setTimeout(() => setPhase('ready'), 3500);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Is the backend running?');
      setPhase('upload');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🏆 SkillSync</h1>
        <p className="app-subtitle">AI-Powered Training Simulator</p>
      </header>

      <main className="app-main">

        {/* UPLOAD */}
        {phase === 'upload' && (
          <div className="card">
            <h2>Step 1: Upload Manual</h2>
            <p className="muted">
              Upload a PDF (Safety Protocol, HR Policy, Technical Guide)
            </p>

            <label className="upload-btn">
              {loading ? 'Processing...' : 'Select PDF File'}
              <input type="file" onChange={handleFileUpload} disabled={loading} />
            </label>

            {loading && (
              <p className="loading-text">Scanning document structure...</p>
            )}
          </div>
        )}

        {/* TRAINING */}
        {phase === 'training' && (
          <div className="card card-training">
            <h2 className="pulse">⚙️ Building Simulation...</h2>
            <p className="muted">
              Injecting domain knowledge into the neural network...
            </p>

            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
          </div>
        )}

        {/* READY */}
        {phase === 'ready' && (
          <div className="card card-ready">
            <div className="checkmark">✓</div>
            <h2>System Ready</h2>
            <p className="muted">
              The AI has ingested <strong>{fileId}</strong> and generated a training scenario.
            </p>

            <button className="start-btn" onClick={() => setPhase('simulation')}>
              Enter Simulation
            </button>
          </div>
        )}

        {/* SIMULATION */}
        {phase === 'simulation' && <SimulationInterface />}
      </main>
    </div>
  );
}

export default App;
