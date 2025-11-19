# 🚀 Real-Time Meme Coin Aggregator  
A production-ready backend service that aggregates **live meme-coin market data** from Dexscreener, caches it in Redis, exposes REST APIs, and streams updates through WebSockets in real time.

---

## 🔗 **LIVE BACKEND URL (Render Deployment)**
### 👉 **https://real-time-coin-aggregator.onrender.com**

Use this URL as the base for all API and WebSocket connections.

---

# 📌 Features
- ⚡ **Real-Time Price Updates** from Dexscreener  
- 🧠 **Redis Caching Layer** for fast and scalable read operations  
- 🌐 **REST API** with pagination for token lists  
- 🔥 **WebSocket Server** streaming live update events  
- 🔄 **Auto-refresh job every 10 seconds**  
- 🚀 **Fully deployed on Render (Free tier)**  
- 📦 **Modular architecture** (API, services, WS, jobs, controllers, state)

---

# 🧱 Architecture Overview

Dexscreener API → Fetcher Job → Redis Cache → REST API → Client App
↓
WebSocket Updates

### ⚙️ Design Decisions  
- **Redis used instead of in-memory storage**  
  → Ensures fast reads & horizontal scaling.  
- **WebSockets instead of polling**  
  → Low latency real-time updates.  
- **Module-based code structure**  
  → Easy to extend, debug, and scale.  
- **Axios + axios-retry**  
  → Handles temporary network/API failures automatically.

---

# 📁 Folder Structure

src/
│── api/
│ └── tokens.js
│── controllers/
│ └── tokens.js
│── jobs/
│ └── refresher.js
│── services/
│ └── dexscreener.js
│── state/
│ └── tokens.js
│── ws/
│ └── server.js
└── index.js
---

# 🌐 REST API Documentation

### ### **GET /**  
Health check endpoint.  
**Response:**  
    ------------
### **GET /api/tokens**

Returns a paginated list of meme-coin tokens from Redis.

#### Query Params:
| Name   | Type | Description |
|--------|------|-------------|
| page   | int  | Page number, default = 1 |
| limit  | int  | Items per page, default = 20 |

#### Example:

GET       https://real-time-coin-aggregator.onrender.com/api/tokens?page=1&limit=10
Output : 

#### Example Response:
json
{
  "data": [...],
  "nextCursor": 2,
  "total": 50
}

🔌 WebSocket Documentation
WebSocket URL  ::    wss://real-time-coin-aggregator.onrender.com

Example Message Received:
{
  "event": "live_update",
  "count": 18
}
WebSocket sends a new update every time the background job refreshes token data.
🔄 Background Task — Token Refresher
Job: startRefresher()
Runs every 5 seconds:
Fetches top meme-coins from Dexscreener.
Cleans & normalizes response.
Saves tokens JSON to Redis.
Broadcasts update count to WebSocket clients.
Environment variable:REFRESH_INTERVAL_MS=10000
🚀 Local Development Setup
1. Install dependencies
npm install
2. Create .env file
PORT=3000
REDIS_URL=your-redis-cloud-url
REFRESH_INTERVAL_MS=10000
3. Start development server
npm run dev
4. Start production server
npm start


🛠 Tech Stack
Node.js
Express
Redis (ioredis)
Axios + axios-retry
WebSockets (ws)
Render Deployment
ESM Modules



👨‍💻 Author

Hemanth Kompala
Real-Time Systems & Backend Developer


---

## ✅ **Your README is now complete, professional, and industry-standard.**

If you want, I can also create:

### 🖼️ A README Banner  
### ✔️ Shields.io badges  
### 📊 API docs in Swagger format  
### 🎨 A frontend dashboard UI plan  

Just tell me!

