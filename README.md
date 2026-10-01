<<<<<<< HEAD
﻿# 🚀 MockMate AI

> AI-powered mock interview platform that helps users practice technical, HR, and behavioral interviews with real-time AI feedback.

<p align="center">
  <img src="./assets/banner.png" alt="MockMate AI Banner" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-green?logo=node.js">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb">
  <img src="https://img.shields.io/badge/Express.js-black?logo=express">
  <img src="https://img.shields.io/badge/License-MIT-blue">
</p>

---

# 📖 Overview

MockMate AI is an intelligent interview preparation platform that simulates real interview experiences using AI.

Users can:

- 📄 Upload their resume
- 🎯 Select interview type
- 🤖 Attend AI-powered mock interviews
- 📊 Receive instant feedback
- 📈 Track interview performance

The goal is to make interview preparation realistic, accessible, and data-driven.

---

# ✨ Features

- 🤖 AI-powered interview generation
- 📄 Resume upload & analysis
- 💼 HR Interview Mode
- 💻 Technical Interview Mode
- 🧠 Behavioral Interview Mode
- 📝 AI-generated feedback
- 📊 Performance analytics
- 🔐 JWT Authentication
- 👤 User Dashboard
- 📱 Responsive UI

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer

## AI

- OpenRouter API
- LLM Integration

## Payment

- Razorpay

---

# 📂 Project Structure

```text
MockMate-AI/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   ├── utils/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/mockmate-ai.git
```

Move into the project

```bash
cd mockmate-ai
```

Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

---

# 🔑 Environment Variables

Before running the application, create the required environment files.

## 📦 Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Backend server port (e.g., `5000`) |
| `TOKEN_SECRET` | Secret key used for signing JWT tokens |
| `TOKEN_EXPIRATION` | JWT expiration time (e.g., `7d`, `24h`) |
| `CLIENT_URL` | Frontend application URL for CORS |
| `OPENROUTER_API_KEY` | API key for OpenRouter AI services |
| `OPENROUTER_MODEL_URL` | OpenRouter API endpoint |
| `OPENROUTER_MODEL_NAME` | AI model name (e.g., `openai/gpt-4.1-mini`) |
| `RAZORPAY_KEY_ID` | Razorpay public key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |

Example:

```env
MONGO_URI=

PORT=5000

TOKEN_SECRET=

TOKEN_EXPIRATION=7d

CLIENT_URL=http://localhost:5173

OPENROUTER_API_KEY=

OPENROUTER_MODEL_URL=https://openrouter.ai/api/v1/chat/completions

OPENROUTER_MODEL_NAME=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

---

## 🎨 Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key used by the frontend |
| `VITE_SERVER_URL` | Backend API base URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key used in the client |

Example:

```env
VITE_FIREBASE_API_KEY=

VITE_SERVER_URL=http://localhost:5000

VITE_RAZORPAY_KEY_ID=
```

---

> **⚠️ Security Notice**
>
> - Never commit `.env` files to Git.
> - Add `.env` and `.env.*` to your `.gitignore`.
> - Keep all API keys, database credentials, and secrets private.
> - If any secret is accidentally exposed, rotate it immediately before continuing development.

⚠️ Never commit your `.env` file.

---

# ▶️ Running Locally

Backend

```bash
cd server
npm run dev
```

Frontend

```bash
cd client
npm run dev
```

---

# 🌍 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | User Login |
| POST | /api/auth/register | User Registration |
| POST | /api/interview/create | Generate Interview |
| POST | /api/interview/submit | Submit Answers |
| GET | /api/user/profile | User Profile |

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Environment Variables
- Input Validation

---

# 📈 Future Improvements

- Voice Interviews
- Video Interviews
- AI Score Comparison
- Company-specific Interview Sets
- Leaderboard
- Interview History
- Multi-language Support

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Commit

```bash
git commit -m "Add new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 🐛 Bug Reports

If you find any bug, please open an issue.

---

# ⭐ Support

If you found this project useful,

⭐ Star the repository

🍴 Fork it

📢 Share it

---

# 📜 License

This project is licensed under the MIT License.

---

# 👥 Contributors

This project was built through the collaboration of passionate developers.
# 👥 Contributors

- **[Surya Majhi](https://github.com/Surya-majhi32038)** — Backend Developer
- **[Sristhi Saha](https://github.com/Sristhi-saha)** — Frontend Developer
  
| Contributor | Role | Responsibilities |
|-------------|------|------------------|
| **Surya Majhi** | Backend Developer | Backend architecture, REST APIs, AI integration, authentication, database design, deployment |
| **Sristhi Saha** | Frontend Developer | UI/UX implementation, React development, responsive design, client-side state management |

---

### Roles

#### 🧑‍💻 Surya Majhi
- Backend System Design
- Express.js & Node.js Development
- MongoDB Database Design
- AI Integration (OpenRouter)
- Authentication & Security
- API Development
- Deployment & DevOps

#### 🎨 Sristhi Saha
- React Frontend Development
- UI/UX Design
- Responsive Layout
- Component Architecture
- State Management
- Frontend Performance Optimization

Made with ❤️ by Surya Majhi
=======
# MockMate_AI
>>>>>>> 8efb9c593281fa0a6c50d68f7e827d61a86627e1
