<div align="center">

# NutriLens
## Smart Nutrition Analytics Platform
</div>

### Abstract

Nutrition tracking is a common challenge for individuals trying to maintain healthy eating habits, primarily because manual calorie and macronutrient logging is time-consuming and error-prone. **NutriLens** addresses this problem by combining computer vision with a full-stack web application to automate meal analysis and nutrition tracking.

Users upload an image of their meal, and the platform uses a YOLOv8-based object detection model to identify the food item. Once the user provides the serving weight, the system calculates estimated nutritional values (calories, protein, fat, and carbohydrates) and stores the result for long-term tracking. Users can view their meal history, calculate their BMI, and export nutrition reports in PDF, CSV, or Excel formats.

A distinguishing feature of NutriLens is its **Nutrition Administrator** role. Unlike a typical admin panel limited to account management, the Nutrition Administrator has visibility into aggregated and individual user nutrition data, enabling data-driven monitoring of eating patterns across the platform — without providing licensed medical or dietary advice.

The platform is built using **React with TypeScript** on the frontend, **FastAPI** on the backend, **PostgreSQL** for data persistence, and **YOLOv8** for food detection. The result is a scalable, secure, and extensible nutrition analytics platform suitable for personal use, fitness programs, and institutional wellness initiatives.

---

## Table of Contents

1. Introduction
2. Literature Survey
3. Requirement Analysis
4. System Design
5. Technology Stack
6. Module Description
7. API Documentation
8. Frontend
9. Backend
10. Security
11. Results
12. Testing
13. Future Enhancements
14. Conclusion
15. References
16. Appendix

---

# Chapter 1 – Introduction

## 1.1 Introduction

Maintaining a healthy diet requires consistent awareness of what one eats, in what quantity, and how it contributes to daily nutritional goals. Traditionally, this has meant manually looking up food items in nutrition databases, estimating portion sizes by eye, and logging values into spreadsheets or apps — a process that is tedious enough that most people abandon it within days or weeks.

At the same time, organizations such as fitness centers, colleges, and wellness programs often want a way to monitor nutrition trends across many people at once, without requiring each individual to maintain detailed logs manually.

**NutriLens** was built to address both problems simultaneously: it automates food recognition and nutrition estimation for individual users, while giving a designated Nutrition Administrator the tools to monitor trends and flag concerning patterns across the user base.

## 1.2 Problem Statement

People struggle to manually estimate calories and nutrition values from meals, leading to inconsistent nutrition tracking. Existing solutions either require excessive manual data entry or lack any mechanism for oversight beyond the individual user, making it difficult for programs (fitness, healthcare, or institutional) to monitor nutrition compliance at scale.

## 1.3 Proposed Solution

NutriLens solves this problem through:

- **Image-based food detection** — users upload a photo of their meal instead of manually searching a food database
- **Automated nutrition calculation** — once the food item is detected and the user provides serving weight, nutrition values are computed automatically
- **Meal history & reports** — users can review past meals and export nutrition summaries in PDF, CSV, or Excel formats
- **Nutrition Administrator monitoring** — a supervisory role with visibility into user nutrition data and platform-wide analytics, enabling proactive oversight

## 1.4 Objectives

- Detect food items from user-uploaded images using computer vision
- Estimate nutritional values (calories, protein, fat, carbohydrates) based on detected food and serving weight
- Allow users to track meal history over time
- Generate exportable nutrition reports
- Provide a BMI calculator as a supplementary health metric
- Provide centralized monitoring and analytics for Nutrition Administrators
- Implement secure, role-based access control between Users and Administrators

## 1.5 Scope

NutriLens is designed to be applicable across multiple contexts:

- **Personal use** — individuals tracking their own nutrition
- **Fitness centers** — trainers monitoring client nutrition alongside workout plans
- **Healthcare-adjacent settings** — supporting (not replacing) professional dietary guidance with data visibility
- **Colleges/hostels** — monitoring dietary patterns of students in managed meal programs
- **Corporate wellness programs** — tracking employee wellness initiatives in aggregate

*Note: NutriLens does not provide medical or licensed dietary advice. Nutrition Administrators use platform data for monitoring and guidance purposes only.*

---

# Chapter 2 – Literature Survey

Several categories of existing tools were reviewed prior to designing NutriLens:

**Manual Calorie Trackers** (e.g., spreadsheet-based logging): These require users to look up nutritional values themselves and log every ingredient and quantity manually. While flexible, they suffer from poor adherence due to the time investment required.

**Mainstream Nutrition Apps**: Popular consumer apps maintain large food databases and allow search-based logging, sometimes with barcode scanning. These reduce lookup effort but still require users to search for and select the correct food item and estimate portions manually. Most also lack any institutional or supervisory oversight layer — they are built purely for individual self-tracking.

**AI-Based Food Recognition Research**: Recent computer vision research has demonstrated that object detection models (including YOLO variants) can identify food items from images with reasonable accuracy, forming the basis for automated nutrition estimation. However, many research prototypes stop at detection and do not integrate the full pipeline — from detection to nutrition calculation to longitudinal tracking to administrative oversight — into a single deployable application.

**Comparison with NutriLens**

| Aspect | Manual Trackers | Mainstream Apps | NutriLens |
|---|---|---|---|
| Food identification | Manual search | Manual search/barcode | Automated via YOLOv8 |
| Portion estimation | Manual | Manual | User-provided weight + automated calculation |
| Administrative oversight | None | Limited/none | Dedicated Nutrition Administrator role |
| Report generation | Manual/none | Limited | PDF, CSV, Excel export |
| Role-based access | N/A | N/A | JWT-based User/Admin roles |

---

# Chapter 3 – Requirement Analysis

## 3.1 Functional Requirements

- User registration and login
- JWT-based authentication and session management
- Meal analysis via image upload
- Nutrition calculation based on detected food and serving weight
- BMI calculation
- Meal history viewing
- Report generation and export (PDF, CSV, Excel)
- Profile management (update details, change password)
- Admin dashboard with platform-wide analytics
- Admin access to user management and meal logs
- Role-based authorization (User vs. Nutrition Administrator)

## 3.2 Non-Functional Requirements

- **Security**: Passwords hashed, JWT-protected routes, role-based access control
- **Scalability**: Modular backend architecture to support growing user base
- **Performance**: Fast response times for image analysis and report generation
- **Reliability**: Consistent nutrition calculations and stable data persistence
- **Usability**: Intuitive UI for both technical and non-technical users

## 3.3 Software Requirements

| Component | Requirement |
|---|---|
| Backend Language | Python 3.12+ |
| Backend Framework | FastAPI |
| Frontend Runtime | Node.js |
| Frontend Framework | React + TypeScript (Vite) |
| Database | PostgreSQL |
| IDE | VS Code |
| ORM | SQLModel |
| Migrations | Alembic |

## 3.4 Hardware Requirements

| Component | Minimum Requirement |
|---|---|
| RAM | 8 GB |
| OS | Windows / Linux |
| Storage | 5 GB free (for dependencies, model weights, database) |
| Camera | Webcam (optional, for capturing meal images directly) |

---

# Chapter 4 – System Design

## 4.1 Architecture Diagram

```
                ┌─────────────────────┐
                │      Frontend        │
                │  React + TypeScript  │
                └──────────┬───────────┘
                           │  REST API (HTTPS)
                           ▼
                ┌─────────────────────┐
                │       FastAPI         │
                │   (Backend Server)    │
                └──────────┬───────────┘
                           │
              ┌────────────┼─────────────┐
              ▼             ▼             ▼
      ┌───────────────┐ ┌──────────┐ ┌─────────────────┐
      │  YOLOv8 Model  │ │ Nutrition │ │   PostgreSQL     │
      │ (Food Detection)│ │ Dataset  │ │  (via SQLModel)  │
      └───────────────┘ └──────────┘ └─────────────────┘
```

The frontend communicates with the backend exclusively through REST APIs. The backend orchestrates authentication, business logic, the ML detection pipeline, and database operations. Detected food items are cross-referenced against a nutrition dataset to compute final values, which are then persisted to PostgreSQL.

## 4.2 Flowchart

```
        User
         │
         ▼
       Login
         │
         ▼
   Upload Meal Image
         │
         ▼
   Food Detection & Analysis
         │
         ▼
   Save to Database
         │
         ▼
      Dashboard
         │
         ▼
   Reports / History
```

## 4.3 Use Case Diagram

**Actors:** User, Nutrition Administrator

**Use Cases:**

| Actor | Use Cases |
|---|---|
| User | Register, Login, Analyze Meal, View History, Calculate BMI, Generate Reports, Manage Profile |
| Nutrition Administrator | Login, View Analytics Dashboard, View All User Meal Logs, Manage Users, Generate Platform Reports |

## 4.4 ER Diagram (Conceptual)

```
   User (1) ────< (M) Prediction (M) >──── (1) Nutrition
```

- One **User** can have many **Predictions** (meal analyses)
- Each **Prediction** references a **Nutrition** record with calculated values

## 4.5 Database Schema

### `User`
| Column | Type | Description |
|---|---|---|
| id | UUID/Integer | Primary key |
| name | String | User's full name |
| email | String | Unique login identifier |
| password | String (hashed) | Hashed password (Passlib) |
| role | Enum | `user` or `admin` |
| created_at | Timestamp | Account creation date |

### `Prediction`
| Column | Type | Description |
|---|---|---|
| id | UUID/Integer | Primary key |
| user_id | Foreign Key → User | Owner of the prediction |
| image_path | String | Stored path/reference to uploaded image |
| detected_food | String | Food item identified by YOLOv8 |
| confidence | Float | Model confidence score |
| serving_weight_g | Float | User-provided serving weight |
| created_at | Timestamp | Analysis timestamp |

### `Nutrition`
| Column | Type | Description |
|---|---|---|
| id | UUID/Integer | Primary key |
| prediction_id | Foreign Key → Prediction | Linked meal analysis |
| calories | Float | Estimated calories |
| protein_g | Float | Estimated protein (grams) |
| fat_g | Float | Estimated fat (grams) |
| carbs_g | Float | Estimated carbohydrates (grams) |

---

# Chapter 5 – Technology Stack

**React (with TypeScript)** — Used for building a responsive, component-based frontend with static typing to reduce runtime errors.

**FastAPI** — Chosen for the backend due to its high performance, automatic OpenAPI/Swagger documentation, and native support for asynchronous request handling.

**PostgreSQL** — A relational database used to persist user accounts, meal predictions, and nutrition records with strong consistency guarantees.

**YOLOv8 (Ultralytics)** — A real-time object detection model used to identify food items from uploaded meal images.

**SQLModel** — Combines SQLAlchemy and Pydantic, used as the ORM layer to define and interact with database models.

**JWT (JSON Web Tokens)** — Used for stateless authentication, allowing secure, scalable session management without server-side session storage.

**Tailwind CSS** — A utility-first CSS framework used to build the frontend UI efficiently and consistently.

**Alembic** — Handles database schema migrations, allowing version-controlled changes to the PostgreSQL schema over time.

---

# Chapter 6 – Module Description

**Authentication Module** — Handles user registration, login, JWT token issuance, and password hashing via Passlib.

**Prediction Module** — Accepts uploaded meal images, runs YOLOv8 inference to detect food items, and returns detection results with confidence scores.

**Nutrition Module** — Takes the detected food item and user-provided serving weight, calculates nutritional values, and stores them linked to the prediction.

**BMI Calculator Module** — Accepts user height and weight to compute and classify BMI.

**Reports Module** — Compiles meal history and nutrition data into downloadable PDF, CSV, or Excel reports.

**Profile Module** — Allows users to view and update their personal details and change their password.

**Analytics Module** — Aggregates platform-wide nutrition data for the Nutrition Administrator dashboard.

**Admin Module** — Provides the Nutrition Administrator with user management tools, meal analysis logs, and platform-wide report generation.

---

# Chapter 7 – API Documentation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user and issue JWT |
| POST | `/prediction/analyze` | Upload meal image and receive nutrition analysis |
| GET | `/nutrition/history` | Retrieve the logged-in user's meal history |
| GET | `/reports/generate` | Generate a nutrition report (PDF/CSV/Excel) |
| GET | `/users/profile` | Retrieve current user profile |
| PUT | `/users/profile` | Update current user profile |
| GET | `/admin/users` | (Admin) List all registered users |
| DELETE | `/admin/users/{id}` | (Admin) Delete a user |
| GET | `/admin/meals` | (Admin) View all meal analysis logs |
| GET | `/admin/analytics` | (Admin) Retrieve platform-wide analytics |


---

# Chapter 8 – Frontend

The frontend is built using React with TypeScript and organized around the following pages:

- **Landing Page** — Introduces the platform to new visitors
- **Login / Register Page** — Handles authentication
- **Dashboard** — Displays a summary of recent activity and nutrition trends
- **Meal Analysis Page** — Allows image upload and displays detection + nutrition results
- **Meal History Page** — Lists past meal analyses in chronological order
- **BMI Calculator Page** — Simple form-based BMI computation
- **Reports Page** — Allows generation and download of nutrition reports
- **Profile Page** — View/edit account details
- **Analytics Page** (Admin only) — Platform-wide nutrition trend visualizations
- **User Management Page** (Admin only) — List, view, and delete users


---

# Chapter 9 – Backend

The backend follows a modular structure under the `app/` directory:

- **Auth/** — Authentication logic, JWT handling, password hashing
- **Users/** — User account management
- **Prediction/** — Image upload handling and YOLOv8 inference logic
- **Nutrition/** — Nutrition calculation logic
- **Reports/** — Report generation (PDF/CSV/Excel)
- **ML/** — Model loading and inference utilities
- **Security/** — Role-based access control and route protection
- **Scripts/** — Utility/maintenance scripts
- **Utils/** — Shared helper functions
- **models/** — SQLModel database models

This modular separation keeps each concern isolated, making the codebase easier to test, extend, and maintain as new features are added.

---

# Chapter 10 – Security

- **JWT Authentication** — Stateless, token-based authentication for all protected routes
- **Password Hashing** — User passwords are hashed using Passlib before storage; plaintext passwords are never persisted
- **Role-Based Access Control** — Distinguishes between `user` and `admin` roles, restricting sensitive endpoints (e.g., user management, platform analytics) to Nutrition Administrators only
- **Protected Routes** — Both frontend routes and backend endpoints validate JWT tokens before granting access

---

# Chapter 11 – Results

- Login Page
- Dashboard
- Meal Analysis (upload + detection results)
- Reports (generated PDF/CSV/Excel samples)
- BMI Calculator
- Analytics Dashboard (Admin)
- User Management (Admin)
- Profile Page

For each screenshot, include a short caption explaining what the screen demonstrates and how it maps back to the corresponding functional requirement from Chapter 3.

---

# Chapter 12 – Testing

| Feature | Expected Result | Actual Result | Status |
|---|---|---|---|
| User Registration | New account created successfully | Pass |
| User Login | JWT token issued on valid credentials | Pass |
| Invalid Login | Login rejected on incorrect credentials | Pass |
| Meal Image Upload | Food item detected and nutrition calculated | Pass |
| BMI Calculation | Correct BMI value and classification returned | Pass |
| Report Generation | Report downloaded in selected format | Pass |
| Admin User Deletion | User removed from database | Pass |
| Unauthorized Access | Non-admin blocked from admin routes | Pass |


---

# Chapter 13 – Future Enhancements

- **Multi-food Detection** — Detect multiple food items within a single image (e.g., a full plate)
- **Barcode Scanner** — Support packaged food nutrition lookup via barcode
- **Mobile Application** — Native or cross-platform mobile app for on-the-go tracking
- **Cloud Deployment** — Host the platform on AWS/GCP/Azure for public accessibility
- **Docker Support** — Containerize the application for simplified deployment
- **Meal Recommendation System** — Suggest meals based on nutrition history and goals
- **Weekly Diet Planner** — Allow users to plan meals in advance with nutrition targets

---

# Chapter 14 – Conclusion

NutriLens successfully demonstrates how computer vision and full-stack web development can be combined to simplify nutrition tracking. By automating food detection and nutrition calculation, the platform significantly reduces the manual effort typically required for dietary logging. The addition of a Nutrition Administrator role extends the platform beyond individual use, enabling data-driven oversight suited to fitness programs, wellness initiatives, and institutional settings.

Through this project, practical experience was gained in full-stack development (React, TypeScript, FastAPI), applied machine learning (YOLOv8 for object detection), secure authentication design (JWT, role-based access), and relational database modeling (PostgreSQL, SQLModel, Alembic). The result is a functional, extensible platform with clear directions for future enhancement.

---
