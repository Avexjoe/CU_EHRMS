# MedVault-Central — University Hospital EHR

A full-stack Electronic Health Records Management System built for Central University Hospital. Manages the complete patient journey from registration through consultation, lab, pharmacy, and billing.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 6 + Django REST Framework |
| Database | PostgreSQL |
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui |
| Auth | DRF Token Authentication |

---

## Project Structure

```
CU_EHRMS/
├── backend/                  # Django REST API
│   ├── core/                 # Settings, URLs, WSGI
│   ├── accounts/             # User auth, roles, token login
│   ├── patients/             # Patient registration & records
│   ├── visits/               # Visit workflow (triage → doctor → lab → pharmacy → billing)
│   ├── appointments/         # Appointment scheduling
│   ├── medical_records/      # Medical records & prescriptions
│   └── billing/              # Billing & payments
└── frontend/                 # React + TypeScript SPA
    └── src/
        ├── pages/            # Role-based dashboards
        ├── components/       # Shared UI components
        ├── hooks/            # usePatients, useVisits, useStaff
        ├── lib/api.ts        # Typed API client
        └── contexts/         # Auth context (real token auth)
```

---

## Roles & Dashboards

| Role | Dashboard | Responsibilities |
|------|-----------|-----------------|
| Admin | AdminDashboard | User management, system health, analytics, hospital resources |
| Receptionist | ReceptionistDashboard | Patient registration, encounter start, check-out queue |
| Nurse | NurseDashboard | Vitals recording, triage, patient queue |
| Doctor | DoctorDashboard | Consultations, prescriptions, lab requests, referrals |
| Lab Tech | LabTechDashboard | Lab test processing, result upload |
| Pharmacist | PharmacistDashboard | Prescription dispensing, drug interaction checks |
| Cashier | CashierDashboard | Payment processing, receipt printing |

---

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ (or Bun)
- PostgreSQL 14+

---

### 1. Clone the repo

```bash
git clone <repo-url>
cd CU_EHRMS
```

---

### 2. Backend setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

#### Create PostgreSQL database

```sql
CREATE DATABASE cental_university_ehr_db;
CREATE USER ehr_user WITH PASSWORD 'ehrpass!@#';
GRANT ALL PRIVILEGES ON DATABASE cental_university_ehr_db TO ehr_user;
```

#### Run migrations & seed data

```bash
python manage.py migrate
python manage.py populate_sample_data   # seeds patients & appointments
python manage.py seed_db                # seeds staff users with roles
```

#### Start backend

```bash
python manage.py runserver
# Runs at http://127.0.0.1:8000/
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev -- --port 3000
# Runs at http://localhost:3000/
```

The Vite dev server proxies `/api/*` → `http://127.0.0.1:8000` automatically.

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cu-ehr.com` | `Admin@123` |
| Doctor | `doctor@hospital.edu` | `Doctor@123` |
| Nurse | `nurse@hospital.edu` | `Nurse@123` |
| Lab Tech | `labtech@hospital.edu` | `Labtech@123` |
| Pharmacist | `pharmacist@hospital.edu` | `Pharma@123` |
| Receptionist | `receptionist@hospital.edu` | `Recept@123` |
| Cashier | `cashier@hospital.edu` | `Cashier@123` |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login, returns token |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/auth/me/` | Current user info |
| GET | `/api/auth/staff/` | List staff (filter by `?role=`) |
| GET/POST | `/api/patients/` | List / register patients |
| PATCH | `/api/patients/{id}/checkin/` | Check in patient |
| GET/POST | `/api/visits/` | List / create visits |
| PATCH | `/api/visits/{id}/` | Update visit (vitals, status, notes) |
| POST | `/api/visits/{id}/prescriptions/` | Add prescription |
| POST | `/api/visits/{id}/lab-requests/` | Add lab request |
| POST | `/api/visits/{id}/lab-results/` | Upload lab result |
| POST | `/api/visits/{id}/payment/` | Manage payment |

All endpoints require `Authorization: Token <token>` header.

---

## Patient Visit Workflow

```
Reception (register + start encounter)
    ↓
Nurse (record vitals, assign doctor)
    ↓
Doctor (consultation, prescriptions, lab requests)
    ↓
Lab Tech (process tests, upload results)  ←──┐
    ↓                                         │
Doctor (review results) ──────────────────────┘
    ↓
Pharmacy (dispense medications, set price)
    ↓
Cashier (process payment, print receipt)
    ↓
Reception (check out)
```

---

## Environment Notes

- `SECRET_KEY` and DB credentials are currently hardcoded for development. Move to `.env` before production.
- `DEBUG=True` — disable in production.
- CORS is configured to allow `localhost:3000` and `localhost:3001` for development.
