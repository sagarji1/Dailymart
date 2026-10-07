<div align="center">
  <img src="https://via.placeholder.com/150/10B981/ffffff?text=Dailymart" alt="Dailymart Logo" width="120" height="120" style="border-radius: 20px;" />
  <h1 align="center">Dailymart ✨</h1>
  <p align="center">
    <strong>Smart Grocery Shopping. Zero Waste. Maximum Savings.</strong>
    <br />
    A state-of-the-art grocery application powered by AI, designed to reduce food waste and optimize predictive pricing.
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#technologies">Technologies</a>
  </p>
</div>

<hr />

## 🌟 Why Dailymart?

Dailymart is not just another grocery store app. It's a next-generation platform integrating **Machine Learning** and **Generative AI** to revolutionize how users buy, manage, and consume fresh produce. Our goal is to drastically reduce global food waste while passing on intelligent discounts directly to the consumer.

## ✨ Features

- 📉 **Predictive Pricing Engine**: A sophisticated Random Forest model predicts exact expiry timelines for produce based on environmental conditions, dynamically dropping prices to ensure items are sold before they go bad.
- 🧠 **WasteGPT Intelligence**: Integrated AI analyzes user purchases and provides intelligent recipe transformations, preservation tips, and expiration alerts.
- 🛒 **Smart Cart Analytics**: Real-time cart monitoring flags items that you might not consume in time based on historical purchasing habits.
- 📊 **Manager Console**: A dedicated admin dashboard for store managers to monitor inventory health, AI alerts, and high-risk items.
- 🌙 **Modern Premium UI**: Built with React and Tailwind CSS v4, featuring dynamic light/dark mode and micro-interactions for a world-class user experience.

---

## 🏗️ Architecture

Dailymart is a full-stack application built using a microservices-inspired architecture:

1. **Client (`/client`)**: A blazing fast React application bundled with Vite. Provides both the customer storefront and the manager console.
2. **Server (`/server`)**: A robust Node.js and Express backend connected to MongoDB. Handles authentication, cart management, user profiles, and purchase history.
3. **Smartfresh AI (`/smartfresh-ai`)**: A Python Flask microservice running a Scikit-Learn `RandomForestRegressor` and connecting to LLMs (WasteGPT) to provide shelf-life predictions and dynamic suggestions.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- MongoDB instance (local or Atlas)

### 1. Setup the Server (Backend)
```bash
cd server
npm install
# Create a .env file and add your MongoDB connection string
npm run dev
```

### 2. Setup the Client (Frontend)
```bash
cd client
npm install
npm run dev
```

### 3. Setup the AI Service (Python Backend)
```bash
cd smartfresh-ai
# (Optional) Create a virtual environment: python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python flask_server.py
```

*Your frontend will run on `http://localhost:5173`, the Node API on `http://localhost:3000`, and the AI service on `http://localhost:5000`.*

---

## 🛠️ Technologies Used

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4**
- **React Router v7**
- **Chart.js** & **React Toastify**

### Backend (Node)
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **JWT Authentication**

### AI Service (Python)
- **Flask**
- **Scikit-Learn** & **Pandas**
- **Transformers / PyTorch**

---

<div align="center">
  <i>Developed for Sparkathon</i>
</div>
