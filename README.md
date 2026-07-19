# 🏙️ Mutual Credit Platform
### AI-Powered Mutual Credit & Business Matching Platform for SMEs

<p align="center">

![HTML](https://img.shields.io/badge/HTML-5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Authentication%20%7C%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Google-Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)

</p>

---

# 📖 Overview

**Mutual Credit Platform** is an AI-powered prototype that enables Small and Medium Enterprises (SMEs) to exchange services using a **mutual credit system** instead of immediate cash payments.

Rather than relying solely on traditional financial transactions, businesses can earn and spend internal credit within the network while building trust and expanding collaboration opportunities.

The platform also integrates **Google Gemini AI** to analyze business profiles and recommend the most suitable partnerships and services available across the network.

---

# ✨ Key Features

## 🔐 Authentication

- Company Registration
- Secure Login
- Firebase Authentication
- Company Profile Creation

---

## 🏢 Company Dashboard

Each company has its own dashboard displaying:

- Company Information
- Credit Balance
- Credit Limit
- Purchasing Power
- Trust Score
- Risk Level

---

## 🛍️ Service Marketplace

Companies can:

- Publish services
- Browse available services
- Search services
- Filter by category
- Request services from other companies

---

## 🤝 Transactions

The platform supports:

- Incoming Requests
- Outgoing Requests
- Pending Requests
- Accept / Reject Requests
- Transaction Completion

Once a transaction is completed:

- Buyer's balance decreases
- Seller's balance increases
- Credit limits are automatically respected

---

## 🤖 AI Smart Recommendations

The platform integrates **Google Gemini API** to generate intelligent business recommendations.

Instead of using simple keyword matching, Gemini analyzes:

- Business type
- Company description
- City
- Trust score
- Credit status
- Available services
- Network businesses

Then recommends the best collaboration opportunities with explanations.

Example:

> Your restaurant frequently requires branded packaging and marketing campaigns. Based on the current businesses available in the network, Noor Marketing provides the most suitable services for your business growth.

---

## 💾 Recommendation Cache

To improve performance and reduce API usage:

- AI analysis is saved in Firestore
- Results are automatically loaded on future visits
- Users may request a fresh analysis anytime using **Reanalyze**

This significantly reduces Gemini API requests.

---

# 🧠 Artificial Intelligence Workflow

```text
Company Data
        │
        ▼
Collect Company Profile
        │
        ▼
Load Available Companies
        │
        ▼
Load Active Services
        │
        ▼
Generate Prompt
        │
        ▼
Google Gemini API
        │
        ▼
Business Analysis
        │
        ▼
Top Collaboration Opportunities
        │
        ▼
Save Analysis in Firestore
        │
        ▼
Display Smart Recommendations
```

---

# 📂 Current Modules

```
Authentication
│
├── Register Company
├── Login
└── Logout

Dashboard
│
├── Company Information
├── Credit Summary
├── Trust Score
└── Purchasing Power

Marketplace
│
├── Publish Services
├── Browse Services
├── Search
├── Categories
└── Service Requests

Transactions
│
├── Pending
├── Accepted
├── Completed
└── Rejected

AI Recommendations
│
├── Business Analysis
├── Gemini Integration
├── Recommendation Cache
└── Reanalyze
```

---

# ⚙️ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES Modules)

## Backend Services

- Firebase Authentication
- Cloud Firestore

## Artificial Intelligence

- Google Gemini API

## Deployment

- Render

---

# 🗂️ Project Structure

```
project
│
├── assets
│   ├── css
│   ├── images
│   └── js
│
├── firebase
│
├── index.html
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/mutual-credit-platform.git
```

---

## Install

No installation is required.

Simply open the project using **Live Server** or deploy it to any static hosting service.

---

# 🔥 Firebase Configuration

Create your own Firebase project.

Enable:

- Authentication
    - Email & Password

- Firestore Database

Then replace your Firebase configuration inside:

```
firebase/firebase-config.js
```

---

# 🤖 Gemini API Setup

Create a Google AI Studio API Key:

https://aistudio.google.com/

Replace your key inside:

```
assets/js/services/gemini-service.js
```

Example:

```javascript
const GEMINI_API_KEY =
"YOUR_API_KEY";
```

---

# 🧩 Current AI Prompt

The application sends:

- Company Information
- Business Description
- Trust Score
- Risk Level
- Credit Information
- Available Businesses
- Active Services

Gemini returns:

- Business Analysis
- Top 3 Recommendations
- Suitability Score
- Recommendation Reason

The response is validated before being displayed.

---

# 💳 Demo Accounts

## 🍔 Burger Restaurant

Email

```
burger@example.com
```

Password

```
b123456
```

---

## 🚚 First Delivery

Email

```
transfer@example.com
```

Password

```
t123456
```

---

# 🧪 Try These Features

After logging in, you can:

- Create a new company account.
- Publish your own services.
- Browse services from other companies.
- Request services.
- Accept transactions.
- Complete transactions.
- Generate AI recommendations.
- Reanalyze recommendations.
- Observe balance updates after completed transactions.

---

# 🚧 Future Improvements

- Mutual Credit Network Visualization
- Debt Netting Algorithm
- AI Risk Assessment
- Credit Scoring Engine
- Company Verification Integration
- Admin Dashboard
- Analytics Dashboard
- Notifications
- Multi-language Support
- Business Performance Insights
- Recommendation Feedback Loop

---

# 🎯 Prototype Objectives

The prototype demonstrates:

- Mutual Credit concepts
- AI-powered business recommendations
- Digital collaboration between SMEs
- Firebase integration
- Google Gemini integration
- Modern frontend architecture

---

# 📷 Screenshots

### 🏠 Dashboard

<img width="1470" alt="Dashboard" src="https://github.com/user-attachments/assets/c9b18412-dd39-4860-8566-e8cc6eb0d3ce" />

---

### 🏠 Dashboard

<img width="1470" alt="Marketplace" src="https://github.com/user-attachments/assets/64995788-1678-4a06-9893-ff81dab4f557" />

---

### 🛒 Service Marketplace 

<img width="1470" alt="Add Service" src="https://github.com/user-attachments/assets/13817a4e-727f-44fd-8f9e-0e68875ab19e" />

---

### ➕  My Services and Add New Service 

<img width="1470" alt="Transactions" src="https://github.com/user-attachments/assets/e219443a-ce4d-431a-a6e4-47b0f9ed01c7" />

---

### 🤝 Transactions

<img width="1470" alt="Transaction Details" src="https://github.com/user-attachments/assets/b8995c34-e03f-465d-b27b-cf637f901e6e" />

---

### 🤖 AI Smart Recommendations

<img width="1470" alt="AI Recommendations" src="https://github.com/user-attachments/assets/f0c885a2-d783-4518-8862-26973778c55e" />

---

### 📊 AI Analysis Results

<img width="1470" alt="AI Analysis" src="https://github.com/user-attachments/assets/70bb8db8-e863-498b-bc66-e980ad9ba8ac" />



---

# 👨‍💻 Developed By

**Nujud Alobaid**

Computer Science Graduate

King Faisal University

---

## 🌐 Live Demo

👉 https://mutual-credit-platform.onrender.com/

---

## 📌 Project Information

This prototype was developed as part of the **Future Cities Program (برنامج مدن المستقبل)** organized by **Basmat Association (جمعية بصمات)**.

The project demonstrates how **Mutual Credit Networks** and **Artificial Intelligence** can be combined to strengthen collaboration between small and medium-sized enterprises (SMEs) through service exchange, trust-based credit, and intelligent business recommendations.

This repository represents an educational and functional prototype created for learning, experimentation, and demonstration purposes. It is **not intended for production or commercial use**.
