# Food Calories Prediction System

An AI-powered Food Calories Prediction System built using **FastAPI**, **YOLOv8**, and **PostgreSQL**. The application detects food items from an uploaded image, calculates nutritional values based on the user-provided weight, stores prediction history, and provides nutrition analytics for users and administrators.

---

# Features

## 1. Authentication

* User Registration
* User Login using JWT Authentication
* Get Logged-in User Details
* Role-Based Authorization (User & Admin)

---

## 2. AI Food Prediction

* Upload Food Image
* Food Detection using YOLOv8
* Confidence Score
* Weight-Based Nutrition Calculation
* Save Prediction History

---

## 3. User Features

* View User Profile
* View Prediction History
* Delete Prediction
* Today's Nutrition Summary
* Weekly Nutrition Summary
* Monthly Nutrition Summary
* Top Consumed Foods

---

## 4. Admin Features

* View All Prediction History
* Admin Dashboard
* Total Users
* Total Predictions
* Total Calories Consumed
* Most Frequently Detected Food

---

# 5. Tech Stack

| Technology           | Purpose                      |
| -------------------- | ---------------------------- |
| FastAPI              | Backend Framework            |
| PostgreSQL           | Database                     |
| SQLModel             | ORM                          |
| Alembic              | Database Migration           |
| JWT                  | Authentication               |
| Passlib              | Password Hashing             |
| YOLOv8 (Ultralytics) | Food Detection               |
| Pillow               | Image Processing             |
| Pandas               | Nutrition Dataset Processing |
| Python               | Programming Language         |

---

# 6. Project Structure

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

# 7. Database Tables

## User

* id
* name
* email
* hashed_password
* role
* created_at

---

## Nutrition

* id
* food_name
* calories_per_100g
* protein
* fat
* carbohydrates
* fiber
* sugar

---

## Prediction

* id
* user_id
* food_name
* weight_grams
* calories
* protein
* fat
* carbohydrates
* fiber
* sugar
* confidence
* image_path
* created_at

---

# 8. Application Workflow

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

# 9. API Endpoints

## Authentication

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /auth/register | Register User      |
| POST   | /auth/login    | Login User         |
| GET    | /auth/me       | Get Logged-in User |

---

## Prediction

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | /prediction/predict         | Predict Food and Calculate Nutrition |
| GET    | /prediction/history         | User Prediction History              |
| DELETE | /prediction/{prediction_id} | Delete Prediction                    |
| GET    | /prediction/today-summary   | Today's Nutrition Summary            |
| GET    | /prediction/weekly-summary  | Weekly Nutrition Summary             |
| GET    | /prediction/monthly-summary | Monthly Nutrition Summary            |
| GET    | /prediction/top-foods       | Most Consumed Foods                  |
| GET    | /prediction/all-history     | View All Prediction History (Admin)  |
| GET    | /prediction/admin-dashboard | Admin Dashboard                      |

---

## User

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| GET    | /users/profile | View User Profile |

---

# 10. Prerequisites

Before running the project, make sure the following software is installed:

* Python 3.12 or later
* PostgreSQL
* Git
* Visual Studio Code (Recommended)
* pip (Python Package Manager)

---

# 11. Installation

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/food-calories-prediction.git
```

## 2. Navigate to the Project

```bash
cd Food_Calories_Project
```

## 3. Create a Virtual Environment

```bash
python -m venv venv
```

## 4. Activate the Virtual Environment

### Windows

```bash
.\venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

## 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 11. Environment Variables

Create a `.env` file inside the **app** directory and add:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/food_calories
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

# 12. Database Setup

Run the database migrations:

```bash
alembic upgrade head
```

Import the nutrition dataset:

```bash
python -m Scripts.import_nutrition
```

---

# 13. Run the Application

Navigate to the **app** directory:

```bash
cd app
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The application will be available at:

```
http://127.0.0.1:8000
```

Swagger API Documentation:

```
http://127.0.0.1:8000/docs
```

ReDoc Documentation:

```
http://127.0.0.1:8000/redoc
```

---

# 14. Future Enhancements

* Update User Profile
* Change Password
* Admin User Management
* React Frontend
* Interactive Charts & Graphs
* Docker Support
* Cloud Deployment (AWS / Render)

---

# Author

**Hirva Kansara**

Computer Science & Business Systems (CSBS)

Pandit Deendayal Energy University (PDEU)

---

