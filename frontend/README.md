# Todo App - Frontend

A modern, responsive Next.js frontend for the todo application with a premium dark theme and glassmorphism design.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Todo Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Real-time Updates**: Instant UI updates after each operation
- **Premium UI Design**: Dark theme with glassmorphism effects and smooth animations
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

## 📋 Prerequisites

- Node.js 18.x or higher
- npm (comes with Node.js)
- Backend API running on http://localhost:8000

## 🛠️ Setup Instructions

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

The app is pre-configured to connect to `http://localhost:8000`. To change this, create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

### 5. Build for Production (Optional)

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home (redirects to login/dashboard)
│   │   ├── globals.css          # Global styles & theme
│   │   ├── login/
│   │   │   └── page.tsx         # Login & Signup page
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Todo dashboard
│   │   └── profile/
│   │       └── page.tsx         # User profile
│   └── lib/
│       └── api.ts               # API client & auth utilities
├── package.json
├── tsconfig.json
└── next.config.js
```

## 📱 Pages Overview

### 1. Login/Signup Page (`/login`)

**Features**:
- Toggle between login and signup modes
- Email and password validation
- Name field for signup
- Real-time error messages
- Smooth animations and transitions

**Form Validation**:
- Email must be valid format
- Password minimum 6 characters
- All fields required

### 2. Dashboard Page (`/dashboard`)

**Features**:
- User greeting with name display
- Add new todos with input field
- Todo list with checkbox, delete button, and creation date
- Task counter (remaining/total)
- Quick access to profile and logout

**Protected Route**: Automatically redirects to `/login` if not authenticated

### 3. Profile Page (`/profile`)

**Features**:
- User avatar with initial
- Display user information (name, email, ID, creation date, todo count)
- Back to dashboard and logout buttons

**Protected Route**: Automatically redirects to `/login` if not authenticated

## 🎨 Design System

### Color Palette

- Dark blue background (#0f0f23)
- Glassmorphism cards with backdrop blur
- Indigo/Purple gradient accents
- Custom scrollbar and animations

### Key Design Elements

- **Glassmorphism**: Frosted glass effect on cards
- **Gradient Buttons**: Smooth transitions on hover
- **Micro-animations**: Fade-in and slide-in effects
- **Custom Scrollbar**: Styled with accent colors

## 🔐 Authentication Flow

1. User enters credentials on login/signup page
2. Frontend sends request to backend API
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token included in Authorization header for protected requests

## 🧪 Testing the Application

1. **Start Backend**: Ensure FastAPI backend is running on port 8000
2. **Open Browser**: Navigate to http://localhost:3000
3. **Create Account**: Sign up with name, email, password
4. **Test Todos**: Add, complete, and delete todos
5. **Test Profile**: View user information
6. **Test Logout**: Logout and login again

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Variables + Tailwind CSS
- **Font**: Inter (Google Fonts)
- **Authentication**: JWT tokens with localStorage

## 📸 Screenshots

### Login Page
![Login Page](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Profile Page
![Profile](./screenshots/profile.png)

## 🔧 Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Run development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

---

**Built with ❤️ using Next.js and TypeScript**
