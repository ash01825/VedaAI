# VedaAI — AI Academic Assessment & Intelligence System

> **Production-grade AI workflow platform for automated question paper generation and academic assessment.**
> Built for the VedaAI engineering assignment — architected as a highly scalable, real-world SaaS platform.

---

## 🏗 Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js 15)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ TanStack     │  │  Zustand     │  │  Socket.IO Client      │ │
│  │ Query Cache  │  │  UI State    │  │  (real-time progress)  │ │
│  └──────┬───────┘  └──────────────┘  └──────────┬─────────────┘ │
└─────────┼────────────────────────────────────────┼───────────────┘
          │ HTTP/REST (File Uploads)                │ WebSocket
          ▼                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API SERVER (Express + TypeScript)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Routes   │  │ Multer   │  │ Socket   │  │   Redis Cache  │  │
│  │ /api/*   │  │ Uploads  │  │ IO Hub   │  │   (BullMQ)     │  │
│  └──────────┘  └────┬─────┘  └──────────┘  └────────────────┘  │
│                     │ enqueue                                     │
│                     ▼                                             │
│  ┌──────────────────────────────┐                                │
│  │     BullMQ Job Queue         │                                │
│  │  veda-generation (3 retries) │                                │
│  │  veda-pdf                    │                                │
│  └──────────────┬───────────────┘                                │
└─────────────────┼───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   WORKER SERVICE (Separate Process)              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              AI Generation Pipeline                      │    │
│  │                                                          │    │
│  │  PDF Parsing → Google GenAI Files API → Prompt Builder   │    │
│  │         ↓                                                │    │
│  │  Gemini Flash 3.5 → Zod JSON Schema → Safe JSON Parser   │    │
│  │         ↓                                                │    │
│  │  Normalization → MongoDB Store → Redis Socket Emit       │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PDF Pipeline                                │    │
│  │  Puppeteer → Render /print/[id] → Save to /uploads/     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
          │                    │
          ▼                    ▼
    ┌──────────┐        ┌──────────┐
    │ MongoDB  │        │  Redis   │
    │ (data)   │        │ (queues) │
    │          │        │ (cache)  │
    └──────────┘        └──────────┘
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- Redis 7+ (local or cloud)
- **Google AI Studio API Key** (Required for Gemini 3.5 Flash)

### 1. Setup Environment Variables
You must provide a Google AI Studio API key to run the AI generation pipeline.
In the `backend` directory, create a `.env` file based on `.env.example`:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and insert your API key:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000

# Enter your Google AI Studio API key here:
GEMINI_API_KEY=your_api_key_here
```

### 2. Start the Database Services
Ensure your local MongoDB and Redis servers are running.
```bash
brew services start mongodb-community
brew services start redis
```
*(Alternatively, you can use the provided docker-compose file if configured).*

### 3. Start the Backend API & Worker
The backend is professionally split into two separate processes: the API server and the background worker queue.
```bash
cd backend
npm install
npm run build

# Start the API Server (Terminal 1)
npm run dev

# Start the Background Worker (Terminal 2)
npm run dev:worker
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

---

## 💡 Current Approaches & Future Scope

### Our Approach to Real-Time AI Generation
Most standard implementations rely on blocking, synchronous API calls (`frontend → backend → AI → response`), which leads to terrible UX and timeouts. Instead, we built a fully asynchronous, decoupled pipeline using **BullMQ** and **Redis**. 
1. The user uploads a PDF and configures the assignment.
2. The Express server immediately returns a "queued" status without blocking.
3. A separate background worker uploads the file to the **Google GenAI File API**, queries **Gemini 3.5 Flash**, enforces a strict JSON schema, and uses a custom safe JSON fallback parser.
4. The worker pushes real-time loading updates (20%, 50%, 90%) back to the client using `@socket.io/redis-emitter`.

### Features Successfully Implemented
- **PDF Document Parsing**: Users can upload research papers or reading materials, and the prompt dynamically integrates the file context using Gemini's native File API.
- **Figma Fidelity**: The frontend matches the provided UI assets pixel-by-pixel, maintaining the exact premium aesthetic requested by the design team.
- **Resilient Output Parsing**: We enforce structured JSON output. If the LLM generates invalid JSON (e.g., escaping apostrophes poorly), our custom `safeParseJSON` utility seamlessly intervenes.
- **Production-Ready**: Separated API routes, models, schemas, and controllers.

### Future Scope & Enhancements
While we have successfully mapped out the core assessment generator, certain options are currently configured for future expansion rather than complete implementation:
- **Multiple Choice Options**: The system correctly identifies and generates high-quality core question text and the corresponding correct answers. However, generating four distinct, plausible multiple-choice options (A, B, C, D) for MCQ questions is currently slated for future scope. Right now, focusing purely on accurate Question-Answer pairs yields the most reliable LLM output and performance.
- **Advanced Context Caching**: We currently cache identical prompts using a simple SHA256 Redis hash. In the future, this can be drastically improved by integrating a Vector Database (like Pinecone or Milvus) to cache semantic embeddings. This would reduce redundant AI API calls for semantically similar uploaded documents.
- **Granular Editing**: The UI fully supports deleting assignments via the dashboard, but inline editing of individual AI-generated questions directly on the page is mapped out for a future product iteration.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand, Socket.IO Client.
- **Backend**: Express.js, TypeScript, Multer, Socket.IO.
- **Infrastructure**: MongoDB (Mongoose), Redis (ioredis), BullMQ.
- **AI / Logic**: Google GenAI SDK (`gemini-3.5-flash`), Zod (Schema Validation), Puppeteer (PDF rendering).

---
*Built to demonstrate top-tier full-stack engineering standards.*
