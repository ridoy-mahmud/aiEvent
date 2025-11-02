# AI Summit - Discover Cutting-Edge AI Conferences

<div align="center">

  **🌐 [Live Demo](https://ai-event-two.vercel.app/)**

  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-8.19-green)](https://www.mongodb.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-12.5-orange)](https://firebase.google.com/)
  [![Deployed with Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black)](https://vercel.com/)

</div>

---

## 🚀 Live Demo

**Visit the live website:** [https://ai-event-two.vercel.app/](https://ai-event-two.vercel.app/)

Your premier destination for discovering cutting-edge AI conferences, workshops, and networking events worldwide.

---

## ✨ Features

- 🎯 **Event Discovery** - Browse and discover AI conferences, workshops, and seminars
- 🔐 **Authentication** - Secure login/registration with email and Google Sign-In
- 📝 **Event Registration** - Register for events and manage your registrations
- 💬 **AI Chatbot** - Interactive chatbot powered by OpenAI for event queries
- 👤 **User Profiles** - Personal profiles with event history
- 🎨 **Modern UI** - Beautiful, responsive design with animated light rays
- ⚡ **Fast Performance** - Optimized with Next.js 16, lazy loading, and image optimization
- 🔒 **Admin Panel** - Admin dashboard for event management

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **Firebase** - Google authentication
- **OGL** - WebGL light rays animation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Express** - Development server (optional)

### AI & External Services
- **OpenAI API** - Chatbot functionality
- **Firebase Authentication** - Google Sign-In
- **Vercel** - Hosting and deployment

---

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account (or local MongoDB)
- Firebase project (for Google Sign-In)
- OpenAI API key (for chatbot)
- Git

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/diveintonext.git
cd diveintonext
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI (for chatbot)
OPENAI_API_KEY=sk-proj-...

# Firebase (for Google Sign-In)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aievent-ebc5f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aievent-ebc5f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aievent-ebc5f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=563709279279
NEXT_PUBLIC_FIREBASE_APP_ID=1:563709279279:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...

# API URL (use /api for Next.js API routes)
NEXT_PUBLIC_API_URL=/api
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Documentation

- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to Vercel
- **[MongoDB Setup](MONGODB_SETUP.md)** - Database configuration
- **[Firebase Setup](FIREBASE_SETUP.md)** - Firebase authentication setup
- **[Firebase Domain Fix](FIREBASE_DOMAIN_FIX.md)** - Troubleshooting unauthorized domain errors
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🏗️ Project Structure

```
diveintonext/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── events/            # Event pages
│   └── ...
├── components/            # React components
├── lib/                   # Utilities and configurations
│   ├── api/              # API client
│   ├── firebase/         # Firebase config
│   ├── models/           # TypeScript models
│   ├── mongodb.ts        # Database connection
│   └── store/            # Redux store
├── public/               # Static assets
└── server/               # Express server (optional, for development)
```

---

## 🚢 Deployment

This project is deployed on [Vercel](https://vercel.com/).

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is private and proprietary.

---

## 🔗 Links

- **Live Website**: [https://ai-event-two.vercel.app/](https://ai-event-two.vercel.app/)
- **Documentation**: See `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/diveintonext/issues)

---

## 👤 Author

Built with ❤️ for the AI community

---

<div align="center">

**[⬆ Back to Top](#ai-summit---discover-cutting-edge-ai-conferences)**

</div>