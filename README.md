# 🎓 UAMAS Frontend

University Assessment & Marking Automation System (UAMAS) – Frontend

This is the frontend for UAMAS, built with React, TypeScript, and Tailwind CSS. It allows lecturers, students, and administrators to interact with the assessment and exam management features of the platform.

---

## ✨ Features

- Responsive, modern UI with Tailwind CSS
- Role-based views:
  - Admin: manage users and roles
  - Lecturer: create/upload assessments, proof AI results, monitor deadlines
  - Student: take or upload handwritten quizzes/assignments
- Real-time feedback from backend AI grading system
- Secure login/authentication flow
- Deadline notifications

---

## ⚙️ Technologies Used

- **React**
- **TypeScript**
- **Tailwind CSS**
- **Axios** (for API calls)
- **React Router**
- **Context API / Redux** (for state management, if used)

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GROUP-12-COMPUTER-SCIENCE/UAMAS-frontend.git
cd uamas-frontend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

---

## 📁 Project Structure

```bash
uamas-frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tailwind.config.js
└── vite.config.ts
```

---

## 🌐 API Integration

Make sure the backend is running and update the `.env` file with the correct base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 📄 License

This project is licensed under the MIT License.
