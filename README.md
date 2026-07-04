<div align="center">

# NutriLens

### Smart Nutrition Analytics Platform

**AI-powered meal analysis, nutrition tracking, and mentor-driven user monitoring — built as a full-stack web application.**

</div>

---

## 📖 Overview

**NutriLens** is a full-stack nutrition analytics platform that lets users analyze meals from food images, estimate nutritional values based on serving weight, monitor eating habits over time, and generate detailed nutrition reports.

It combines computer vision (YOLOv8) with a modern web interface to turn food tracking from manual guesswork into an automated, data-driven process — while giving admins the tools to actively guide users rather than just store their data.

---

## 🎯 Project Objectives

- Automate food recognition and nutrition estimation using computer vision
- Remove the friction of manual calorie/macro logging
- Give users a clear, ongoing picture of their eating habits
- Enable a supervised nutrition model where admins can monitor and guide users, not just manage accounts
- Provide exportable, shareable nutrition reports for personal or clinical use
- Build the platform on a modern, scalable full-stack architecture

---

## 🧑‍⚕️ Nutrition Monitoring Concept

NutriLens is built around a **human-in-the-loop mentorship model**, not pure self-tracking.

- **Users** log meals independently — the system handles detection and nutrition calculation automatically.
- **Admins** have full visibility into every user's meal history, nutrition trends, and analysis logs — effectively functioning as a **nutritionist or mentor** rather than a backend operator.

This means an admin can:
- Spot unhealthy eating patterns across users before they become long-term habits
- Monitor at-risk users based on real logged nutrition data, not self-reported summaries
- Step in with guidance backed by actual data, the way a nutrition coach would

Users get automated tracking. Admins get the visibility to actually coach.

---

## ✨ Key Features

### 👤 User Features
- Secure registration & login with JWT authentication
- Meal analysis using food images
- Automatic nutrition estimation based on serving weight
- BMI calculator
- Meal history tracking
- Nutrition reports (PDF, CSV & Excel export)
- Profile management & password updates
- Personalized nutrition insights

### 🛡️ Admin Features (Nutritionist/Mentor View)
- Full visibility into every user's meal history and nutrition trends
- Platform analytics dashboard to spot eating patterns at scale
- Meal analysis logs & prediction history per user
- User management (view, delete)
- Platform-wide report generation
- Role-based access control

---

## 👥 User & Admin Roles

| Role | Capabilities |
|---|---|
| **User** | Analyze meals, view history, download reports, use BMI calculator, manage profile |
| **Admin** | Acts as nutritionist/mentor — full visibility into user nutrition data, analytics dashboard, meal analysis logs, platform reports, user management |

---

## 🏗 Architecture Diagram

```text
┌─────────────────────┐        ┌──────────────────────┐
│      Frontend        │  HTTP  │       Backend         │
│  React + TypeScript  │◄──────►│   FastAPI (Python)    │
│      (Vite)          │  REST  │                        │
└─────────────────────┘        └──────────┬────────────┘
                                            │
                     ┌──────────────────────┼───────────────────────┐
                     ▼                      ▼                       ▼
            ┌────────────────┐   ┌───────────────────┐   ┌────────────────────┐
            │   PostgreSQL    │   │   YOLOv8 Model     │   │   Report Generator  │
            │  (SQLModel ORM) │   │  (Food Detection)  │   │  (PDF / CSV / Excel) │
            └────────────────┘   └───────────────────┘   └────────────────────┘
```

- **Frontend** communicates with the backend via REST APIs (Axios)
- **Backend** handles auth, business logic, and orchestrates the ML pipeline
- **YOLOv8** performs food detection on uploaded images
- **PostgreSQL** persists users, meals, and predictions via SQLModel + Alembic migrations
- **Report Generator** compiles nutrition data into downloadable reports

---

## 🧠 Workflow

```text
            Upload Meal Image
                    │
                    ▼
        Food Detection (YOLOv8)
                    │
                    ▼
      User Enters Serving Weight
                    │
                    ▼
      Nutrition Calculation Engine
                    │
                    ▼
      Save Meal Analysis to Database
                    │
                    ▼
Dashboard • History • Reports • Analytics
```

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Axios, React Router |
| **Backend** | FastAPI, Python, SQLModel, PostgreSQL, Alembic, JWT, Passlib |
| **AI / ML** | YOLOv8 (Ultralytics), Pillow, Pandas |

---

## 📂 Folder Structure

```text
NutriLens/
│
├── app/
│   ├── Auth/
│   ├── Users/
│   ├── Prediction/
│   ├── Nutrition/
│   ├── Reports/
│   ├── ML/
│   ├── Security/
│   ├── Scripts/
│   ├── Utils/
│   ├── models/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│
├── README.md
│
└── .gitignore
```

---

## 📦 Installation

```bash
git clone https://github.com/hirvakansara/NutriLens.git
cd NutriLens
```

---

## ⚙ Environment Variables

Create a `.env` file inside the `app/` folder:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/nutrilens
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🖥 Backend Setup

```bash
python -m venv venv

# Activate the environment
# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r app/requirements.txt

# Run database migrations
alembic upgrade head

# Start the backend
uvicorn app.main:app --reload
```

- Backend: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Register a new user |
| `/auth/login` | POST | Authenticate and receive a JWT token |
| `/prediction/analyze` | POST | Upload a meal image and get nutrition analysis |
| `/nutrition/history` | GET | Retrieve a user's meal history |
| `/reports/generate` | GET | Generate a nutrition report (PDF/CSV/Excel) |
| `/admin/users` | GET | Admin: list all users |
| `/admin/meals` | GET | Admin: view all meal analysis logs |

**Example request:**
```bash
curl -X POST "http://127.0.0.1:8000/prediction/analyze" \
  -H "Authorization: Bearer <your_token>" \
  -F "image=@meal.jpg" \
  -F "serving_weight=250"
```

**Example response:**
```json
{
  "food_item": "grilled chicken breast",
  "confidence": 0.91,
  "serving_weight_g": 250,
  "nutrition": {
    "calories": 412,
    "protein_g": 58.5,
    "fat_g": 14.2,
    "carbs_g": 0.0
  }
}
```

Full interactive API documentation is available via Swagger at `/docs` once the backend is running.

---


## 🚀 Future Enhancements

- Multi-food detection in a single image
- Barcode scanner integration
- Mobile application
- Cloud deployment (AWS / GCP / Azure)
- Docker support for one-command setup
- Meal recommendation system
- Weekly diet planner

---

## 👩‍💻 Author

**Hirva Kansara**


GitHub: [github.com/hirvak](https://github.com/hirvak)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star.

**NutriLens** — Smart Nutrition Analytics Platform
Built with FastAPI, React, and YOLOv8

</div>