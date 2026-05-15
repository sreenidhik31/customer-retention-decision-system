# Customer Retention Decision Engine

A full-stack machine learning application that transforms telecom churn predictions into ROI-driven customer retention decisions.

The system combines machine learning, business decision logic, FastAPI APIs, and a deployed Next.js frontend to help businesses identify high-risk customers, estimate financial impact, and simulate retention strategies.

## Live Demo

Frontend: https://customer-retention-decision-system.vercel.app/

Backend API Docs: https://customer-retention-decision-system.onrender.com/docs

---

# Features

* Telecom churn prediction using Logistic Regression
* Real-time inference with FastAPI
* Full-stack frontend built with Next.js and TypeScript
* Risk segmentation (SAFE / AT_RISK / HIGH_RISK)
* ROI-driven retention recommendations
* Retention strategy simulation
* Threshold and campaign optimization
* Render + Vercel deployment
* API proxy routing and CORS-safe integration

---

# Tech Stack

### Machine Learning

* Python
* Scikit-learn
* Pandas
* NumPy

### Backend

* FastAPI
* Pydantic
* Uvicorn

### Frontend

* Next.js
* React
* TypeScript

### Deployment

* Render
* Vercel

---

# Project Workflow

User Input
→ Next.js Frontend
→ API Proxy Routes
→ FastAPI Backend
→ ML Pipeline
→ Business Decision Layer
→ ROI + Retention Recommendations

---

# ML Pipeline

The project uses a Scikit-learn Pipeline with:

* StandardScaler for numerical preprocessing
* OneHotEncoder for categorical encoding
* Logistic Regression for churn prediction

Performance:

* Accuracy: ~0.79
* ROC-AUC: ~0.83

---

# Business Decision Layer

The system converts churn probabilities into actionable retention decisions.

Outputs include:

* churn probability
* risk segment
* retention priority
* expected revenue loss
* intervention cost
* net value
* ROI
* recommended retention action

---

# API Endpoints

### Predict Customer Churn

```bash
POST /predict
```

### Simulate Retention Campaign

```bash
POST /campaign
```

### Health Check

```bash
GET /health
```

---

# Local Setup

## Clone Repository

```bash
git clone <repository-url>
cd Customer-Retention-Decision-System
```

---

## Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\\Scripts\\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```bash
http://127.0.0.1:8000
```

Swagger Docs:

```bash
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```bash
http://localhost:3000
```

---

# Engineering Challenges Solved

* CORS handling between Vercel and Render
* API proxy routing with Next.js
* Real-time inference integration
* sklearn inference payload validation
* Frontend/backend deployment debugging

---

# Future Improvements

* Batch CSV upload
* SHAP explainability
* Customer lifetime value modeling
* Prediction logging
* Model monitoring and drift detection
* Docker containerization

