# Food Calories Prediction System

An AI-powered **Food Calories Prediction System** built using **FastAPI**, **YOLOv8**, and **PostgreSQL**. The application detects food items from an uploaded image, calculates nutritional values based on the user-provided weight, stores prediction history, and provides nutrition analytics for users and administrators.

---

# Project Objectives

- Detect food items using the YOLOv8 deep learning model.
- Calculate nutritional values based on food weight.
- Store prediction history in PostgreSQL.
- Provide nutrition summaries and analytics.
- Implement secure JWT Authentication with Role-Based Access Control.

---

# Features

## 1. Authentication

- User Registration
- User Login using JWT Authentication
- Get Logged-in User Details
- Update User Profile
- Change Password
- Role-Based Authorization (User & Admin)

---

## 2. AI Food Prediction

- Upload Food Image
- Food Detection using YOLOv8
- Confidence Score
- Weight-Based Nutrition Calculation
- Save Prediction History

---

## 3. User Features

- View User Profile
- Update User Profile
- Change Password
- View Prediction History
- Delete Prediction
- Prediction History Pagination
- Today's Nutrition Summary
- Weekly Nutrition Summary
- Monthly Nutrition Summary
- Top Consumed Foods

---

## 4. Admin Features

- Admin Dashboard
- View All Users
- Delete User
- View All Prediction History
- User Pagination
- Total Users
- Total Predictions
- Total Calories Consumed
- Most Frequently Detected Food

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
| FastAPI | Backend Framework |
| PostgreSQL | Database |
| SQLModel | ORM |
| Alembic | Database Migration |
| JWT | Authentication |
| Passlib | Password Hashing |
| YOLOv8 (Ultralytics) | Food Detection |
| Pillow | Image Processing |
| Pandas | Nutrition Dataset Processing |
| Python | Programming Language |

---

# Backend Highlights

- RESTful API
- JWT Authentication
- Password Hashing
- Role-Based Access Control
- SQLModel ORM
- Alembic Database Migration
- Pagination Support
- PostgreSQL Integration

---

# Project Structure

```text
Food_Calories_Project/
│
├── app/
│   ├── Auth/
│   ├── Users/
│   ├── Prediction/
│   ├── Nutrition/
│   ├── ML/
│   ├── Security/
│   ├── Scripts/
│   ├── Utils/
│   ├── alembic/
│   ├── models/
│   ├── main.py
│   └── requirements.txt
│
├── Models/
├── .gitignore
└── README.md
```

---

# Database Tables

## User

- id
- name
- email
- hashed_password
- role
- is_active
- created_at

---

## Nutrition

- id
- food_name
- calories_per_100g
- protein
- fat
- carbohydrates
- fiber
- sugar

---

## Prediction

- id
- user_id
- food_name
- weight_grams
- calories
- protein
- fat
- carbohydrates
- fiber
- sugar
- confidence
- image_path
- created_at

---

# Application Workflow

```text
User
   │
   ▼
Upload Food Image
   │
   ▼
YOLOv8 Model
   │
   ▼
Food Detection
   │
   ▼
Nutrition Lookup
   │
   ▼
User Enters Weight
   │
   ▼
Nutrition Calculation
   │
   ▼
Save Prediction
   │
   ▼
Prediction History & Analytics
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/register | Register User |
| POST | /auth/login | Login User |
| GET | /auth/me | Get Logged-in User |

---

## Prediction

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /prediction/predict | Predict Food & Calculate Nutrition |
| GET | /prediction/history | Prediction History (Paginated) |
| DELETE | /prediction/{prediction_id} | Delete Prediction |
| GET | /prediction/today-summary | Today's Nutrition Summary |
| GET | /prediction/weekly-summary | Weekly Nutrition Summary |
| GET | /prediction/monthly-summary | Monthly Nutrition Summary |
| GET | /prediction/top-foods | Top Consumed Foods |
| GET | /prediction/all-history | View All Prediction History (Admin) |
| GET | /prediction/admin-dashboard | Admin Dashboard |

---

## Users

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /users/profile | View User Profile |
| PATCH | /users/profile | Update User Profile |
| PATCH | /users/change-password | Change Password |
| GET | /users/admin/users | Get All Users (Admin) |
| DELETE | /users/admin/users/{user_id} | Delete User (Admin) |

---

# Prerequisites

Before running the project, install:

- Python 3.12 or later
- PostgreSQL
- Git
- Visual Studio Code (Recommended)
- pip (Python Package Manager)

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/hirvak/food-calories-prediction.git
```

## 2. Navigate to the Project

```bash
cd Food_Calories_Project
```

## 3. Navigate to the App Folder

```bash
cd app
```

## 4. Create Virtual Environment

```bash
python -m venv venv
```

## 5. Activate Virtual Environment

### Windows

```bash
.\venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

## 6. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file inside the **app** directory.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/food_calories
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

# Database Setup

Run Alembic migrations:

```bash
alembic upgrade head
```

Import nutrition data:

```bash
python -m Scripts.import_nutrition
```

---

# Run the Application

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Application:

```
http://127.0.0.1:8000
```

Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

# Future Enhancements

- React Frontend
- Interactive Charts & Graphs
- Food Recommendation System
- Multi-Food Detection in a Single Image
- Nutrition Trends & Reports
- Docker Support
- Cloud Deployment (AWS / Render)

---

**Hirva Kansara**

---
