# 🍽️ SmartDine – Food Discovery Assistant

SmartDine is an AI-powered food discovery assistant designed to help Indian college students and young professionals decide **what to eat and where to eat**, based on their mood, budget, and cravings — using natural, conversational input instead of boring filters.

---

## 🚀 Problem Statement

Food decision-making is surprisingly hard:
- Too many restaurants
- No clarity on what fits your **mood**, **budget**, or **cravings**
- Existing apps focus on filters, not conversations

SmartDine solves this by acting like a **smart food buddy** that understands what the user *feels like eating* and recommends suitable local restaurants with clear explanations.

---

## 🎯 Key Features

### 💬 Conversational Food Search
Users can type natural queries like:
- *“Something cheesy but not too expensive”*
- *“Comfort food after a rough day”*
- *“Late night snacks near me”*

The assistant understands intent and responds intelligently.

---

### 🏪 Curated Restaurant Directory
- 15–20 local eateries
- Each restaurant includes:
  - Cuisine type
  - Price range
  - Ratings & reviews
  - Location

Data can be sourced from:
- Google Places API
- Foursquare API
- Or manually curated datasets

---

### 🧠 Explainable Recommendations
Instead of generic suggestions, SmartDine explains **why** a restaurant is recommended:

> *“Try Sharma’s Dhaba because you wanted something cheap and filling, and their thali is legendary.”*

This builds trust and improves user experience.

---

### 🎲 “Surprise Me” Feature
For indecisive users, SmartDine offers a **Surprise Me** option that suggests a random but relevant restaurant based on basic constraints like budget and location.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Chat-style conversational UI
- Restaurant recommendation cards

### Backend
- Node.js
- Express.js
- RESTful APIs

### Data & APIs
- Google Places API / Foursquare API (free tier)
- Option for manual dataset creation

### Recommendation Logic
- Keyword and intent-based matching
- Context-aware ranking using:
  - Cuisine
  - Budget
  - Ratings
  - User query intent

---

## 🧩 System Workflow

1. User enters a natural language food query
2. Query is analyzed for intent (mood, budget, cuisine)
3. Matching restaurants are filtered and ranked
4. Top recommendations are returned with explanations
5. User can explore results or use “Surprise Me”

---

## 📌 Future Enhancements

- Personalized recommendations using user history
- Embedding-based semantic search
- Distance-based ranking
- User likes/dislikes learning
- Trending dishes and restaurants
- Mobile app version

---


## 🧪 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Janhani-D/SmartPlate.git

# Install dependencies
npm install

# Start backend server
npm start

# Start frontend
npm run dev
