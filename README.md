# Speaker Diarization

A live transcription and speaker diarization tool that combines Whisper-based automatic speech recognition with visual speaker activity detection (facial landmarks and mouth-movement analysis) to identify *who is speaking and what they're saying* in real time.

## Overview

Audio is transcribed with Whisper, and speaker attribution is assisted by MediaPipe facial landmarks plus CNN models trained to detect mouth movement / speech activity from video. A Python (Flask + Socket.IO) backend serves transcription and WebRTC signaling, and a React + TypeScript frontend provides the UI for file uploads and live video calls.

## Repository Structure

```
Backend/                      Python ML code
├── AudioTranscription/       Whisper / faster-whisper notebooks
├── FacialLandmarks/          MediaPipe mouth-landmark tracking (Landmarks.py, Basics.py)
├── Cascades/                 OpenCV Haar cascade experiments
├── Models/                   Model architecture notebooks
│                             (BaseModel, HybridModel, MovinetModel, LipNet)
├── Servers/                  Server.ipynb (Flask, :5000)
│                             SignallingServer.ipynb (WebRTC signaling, :5001)
├── requirements.txt
└── run.sh

frontend/                     React 18 + TypeScript + Vite app
└── src/components/           FileUpload.tsx, VideoCall.tsx, VideoPlayer.tsx

Demo/                         Sample media and trained model weights
```

## Tech Stack

- **Backend:** Python, Whisper, TensorFlow/Keras, OpenCV, MediaPipe, Flask, Socket.IO
- **Frontend:** React 18, TypeScript, Vite, Socket.IO client, WebRTC

## Getting Started

### Backend

```bash
cd Backend
pip install -r requirements.txt
./run.sh
```

Run `Backend/Servers/Server.ipynb` for the Flask transcription server (port 5000) and `Backend/Servers/SignallingServer.ipynb` for the WebRTC signaling server (port 5001).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## How It Connects

- The frontend POSTs media files to the Flask backend on `localhost:5000` for transcription.
- Live video calls use Socket.IO signaling on `localhost:5001` to establish WebRTC peer connections, streaming video frames for real-time diarization and transcription.
