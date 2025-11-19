#  Real-Time Meme Coin Aggregator  
A production-ready backend service that aggregates **live meme-coin market data** from Dexscreener, caches it in Redis, exposes REST APIs, and streams updates through WebSockets in real time.

---

##  **LIVE BACKEND URL (Render Deployment)**
###  **https://real-time-coin-aggregator.onrender.com**

Use this URL as the base for all API and WebSocket connections.

 Public API Endpoint

Your backend exposes a live API for fetching aggregated meme-coin data: 

 GET – Fetch tokens
https://real-time-coin-aggregator.onrender.com/api/tokens

 WebSocket Real-Time Updates

Your backend supports live streaming token price updates using WebSockets.

 WebSocket URL

 wss://real-time-coin-aggregator.onrender.com/ws

Connect to this URL to receive push-based live token updates every 10 seconds with help of piesockets which I mentioned below.


Postman 
This was used for rapid API calls for multiple clients to access at a time in parllel manner.

---

#  Features
-  **Real-Time Price Updates** from Dexscreener  
-  **Redis Caching Layer** for fast and scalable read operations  
-  **REST API** with pagination for token lists  
-  **WebSocket Server** streaming live update events  
-  **Auto-refresh job every 10 seconds**  
-  **Fully deployed on Render (Free tier)**  
-  **Modular architecture** (API, services, WS, jobs, controllers, state)

---

 System Architecture

This project is a real-time crypto token aggregator built to replicate the behaviour of Axiom Trade’s Discover page.
It continuously fetches token data from multiple external sources, merges them intelligently, caches them for fast access, and pushes live updates to connected clients via WebSockets.


              ┌──────────────────────────────┐
              │  DexScreener API             │
              └───────────────┬──────────────┘
                              │
                              ▼
              ┌──────────────────────────────┐
              │  Jupiter API                 │
              └───────────────┬──────────────┘
                              │
                              ▼
                   (1) Fetch & Normalize
                              │
                              ▼
              ┌──────────────────────────────┐
              │  Aggregator Module           │
              │  - merge tokens              │
              │  - remove duplicates         │
              │  - calculate sorting fields  │
              └───────────────┬──────────────┘
                              │
                              ▼
                   (2) Cache in Redis
                              │
                              ▼
              ┌──────────────────────────────┐
              │  Redis (External Cloud DB)   │
              └───────────────┬──────────────┘
                              │
                ┌─────────────┴───────────────┐
                │                               │
                ▼                               ▼
     (3) API Server (Express)          (4) WebSocket Server
     GET /api/tokens                   Live push every refresh
     Paginated tokens                  Broadcast token updates
                │                               │
                └─────────────┬─────────────────┘
                              ▼
                     Client (browser/Postman)

### ⚙️ Design Decisions  
- **Redis used instead of in-memory storage**  
  → Ensures fast reads & horizontal scaling.
  → O(1) reads
  → Cloud-hosted, zero-maintenance 
  → Extremely low latency 
- **WebSockets instead of polling**  
  → Low latency real-time updates.
  →  Persistent connection
  →  No re-connection overhead
  →  Real-time push architecture
- **Module-based code structure**  
  → Easy to extend, debug, and scale.
  → Fetches all tokens in background
  → API only reads from Redis
  → WebSocket broadcasts new data
- **Axios + axios-retry**  
   → Handles temporary network/API failures automatically.
   → Rate limit
   → Timeout
   → Reduced failure rate



#  REST API Documentation

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
PieSocket is used only for testing and demonstrating WebSocket functionality during the live demo.
Browsers connect to WebSocket URLs directly through the url in piesocket :  ** wss://real-time-coin-aggregator.onrender.com/ws **
This was useful for real time distrubuted updates.

 Background Task — Token Refresher
Job: startRefresher()
Runs every 5 seconds:
Fetches top meme-coins from Dexscreener.
Cleans & normalizes response.
Saves tokens JSON to Redis.
Broadcasts update count to WebSocket clients.
Environment variable:REFRESH_INTERVAL_MS=10000


 Local Development Setup
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



 Author

Hemanth Kompala
Real-Time Systems & Backend Developer


---

##  **Your README is now complete, professional, and industry-standard.**

If you want, I can also create:

###  A README Banner  
###  Shields.io badges  
###  API docs in Swagger format  
###  A frontend dashboard UI plan  

Just tell me!

