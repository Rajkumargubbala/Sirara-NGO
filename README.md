# SITATRA Association Platform

A fully functional, CMS-driven premium NGO website built with the MERN stack (Next.js, Node.js, Express, MongoDB).

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React, TanStack Query.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.
- **CMS**: Dynamic Section-based content management with Rich Text Editor (React Quill).
- **Integrations**: WhatsApp Click-to-Chat, SMTP (Nodemailer ready), Cloudinary (Media ready).

## ✨ Key Features

- **Dynamic CMS**: Manage every piece of content (Home, About, etc.) via the Admin Dashboard.
- **Premium Design**: Dark Green & Dark Brown palette with serif typography for a high-end NGO look.
- **Impact Focused**: Animated statistics, success stories, and impact-based donation system.
- **Fully Responsive**: Mobile-first architecture with smooth transitions and touch-friendly UI.
- **SEO Optimized**: Dynamic meta tags, clean URLs, and semantic HTML.
- **Secure**: Helmet.js, JWT Authentication, and input sanitization.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```
Run the server:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
```
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Run the client:
```bash
npm run dev
```

## 🔐 Admin Access
- **URL**: `/admin/login`
- **Email**: `admin@sitatra.org`
- **Password**: `admin123`

## 📂 Project Structure

```
Sirara/
├── client/ (Next.js Frontend)
│   ├── src/
│   │   ├── app/ (Pages & Routing)
│   │   ├── components/ (UI & Layout)
│   │   ├── services/ (API Calls)
│   │   └── lib/ (Utilities)
├── server/ (Node.js Backend)
│   ├── models/ (Database Schemas)
│   ├── routes/ (API Endpoints)
│   ├── controllers/ (Business Logic)
│   ├── middleware/ (Security & Auth)
│   └── config/ (DB Connection)
```

Developed with ❤️ for SITATRA Association.
