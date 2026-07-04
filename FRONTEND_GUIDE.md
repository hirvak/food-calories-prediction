# Frontend Development Guide

## IMPORTANT - DO NOT MODIFY THE BACKEND

The backend of this project is **already completed and fully functional**.

### Strict Rules

- DO NOT modify any backend code.
- DO NOT rename any backend folders.
- DO NOT rename any backend files.
- DO NOT modify any FastAPI routes.
- DO NOT modify any controllers.
- DO NOT modify any models.
- DO NOT modify any schemas.
- DO NOT modify any database tables.
- DO NOT modify any Alembic migrations.
- DO NOT modify the existing project structure.
- DO NOT change any API request or response formats.
- DO NOT install frontend packages inside the backend.

The backend must remain exactly as it is.

---

# Create a Separate Frontend

Create an entirely separate frontend project.

Project structure should become:

```text
Food_Calories_Project/

├── app/                     ← Existing FastAPI Backend (DO NOT TOUCH)
│
├── frontend/                ← CREATE THIS NEW PROJECT
│
├── Models/
│
├── README.md
│
├── FRONTEND_GUIDE.md
│
└── .gitignore
```

The frontend must be completely independent.

Use the backend only through REST API calls.

---

# Frontend Technology Stack

Use:

- React
- Vite
- TypeScript
- Axios
- React Router DOM
- Tailwind CSS
- React Hook Form
- React Icons

Do not use Redux.

Use Context API for Authentication.

---

# Backend Information

Backend Framework:

FastAPI

Authentication:

JWT

API Base URL

http://127.0.0.1:8000

Swagger

http://127.0.0.1:8000/docs

---

# Authentication Flow

Login

↓

Receive JWT Token

↓

Store Token in localStorage

↓

Attach

Authorization: Bearer <token>

to every protected request.

If token expires:

Redirect user to Login page.

---

# User Roles

Two roles exist.

## User

Can access:

- Dashboard
- Predict Food
- Prediction History
- User Profile
- Update Profile
- Change Password
- Today's Summary
- Weekly Summary
- Monthly Summary
- Top Foods

---

## Admin

Can access everything above plus:

- Admin Dashboard
- User Management
- All Prediction History

Hide Admin pages for normal users.

---

# Frontend Folder Structure

Create

```text
frontend/

src/

assets/

components/

layouts/

pages/

services/

hooks/

context/

types/

utils/

App.tsx

main.tsx
```

---

# Pages

Generate the following pages.

## Login

- Email
- Password
- Login Button
- Register Link

---

## Register

- Name
- Email
- Password
- Register Button
- Login Link

---

## Dashboard

Display

- Today's Calories
- Weekly Calories
- Monthly Calories
- Top Foods

Use summary cards.

---

## Predict Food

Components

- Upload Image
- Enter Weight
- Predict Button

Show

- Food Name
- Confidence
- Calories
- Protein
- Fat
- Carbohydrates
- Fiber
- Sugar

Display result inside a beautiful card.

---

## Prediction History

Table

Columns

- Food
- Weight
- Calories
- Date
- Delete Button

Features

- Pagination

---

## User Profile

Display

- Name
- Email
- Role

Buttons

- Update Profile
- Change Password

---

## Update Profile

Editable

- Name
- Email

---

## Change Password

Fields

- Old Password
- New Password
- Confirm Password

---

## Admin Dashboard

Cards

- Total Users
- Total Predictions
- Total Calories
- Most Predicted Food

---

## User Management

Table

Columns

- Name
- Email
- Role
- Delete Button

Features

- Pagination

---

# Components

Create reusable components.

Examples

- Navbar
- Sidebar
- Dashboard Card
- Prediction Card
- Table
- Pagination
- Modal
- Button
- Input
- Card
- Spinner
- Toast Notification
- Protected Route
- Admin Route

---

# API Integration

Use Axios.

Create a dedicated service layer.

Example

services/

authService.ts

predictionService.ts

userService.ts

adminService.ts

Do not place Axios calls directly inside page components.

---

# UI Requirements

The UI should be modern and professional.

Theme

Primary Color

Green

Secondary

White

Background

Light Gray

Cards

White

Rounded Corners

Soft Shadows

Use icons where appropriate.

Responsive for desktop, tablet and mobile.

---

# Code Quality

Use

- TypeScript Interfaces
- Reusable Components
- Functional Components
- React Hooks
- Context API
- Proper Folder Structure

Avoid duplicate code.

---

# Expected Output

Generate

- A complete React frontend.
- A new `frontend/` folder.
- No backend modifications.
- Clean and reusable code.
- Fully responsive UI.
- Production-quality frontend.