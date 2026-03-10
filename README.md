Central University Electronic Health Records (EHR) System

## Project Overview

This is a **web-based Electronic Health Records (EHR) system** designed for a university hospital/clinic serving approximately **200 students** with a **21-bed** capacity. The system is built using **Django** (Python web framework) and **PostgreSQL** database, focusing on secure, role-based access for hospital staff.

The application follows a simple, linear patient workflow suitable for a small-scale university health service.

### Target Users & Roles

- Receptionist
- Nurse
- Doctor
- Pharmacist
- Cashier
- Lab Technician
- Admin (system administrator)

### Core Workflow

1. **Patient Arrival & Registration** (Receptionist)
   - New patient: Register with Student ID, Ghana Card/NHIS, DOB, address, emergency contacts, multiple birth flag
   - Generate unique **Hospital ID**
   - Check-in frequent patients
   - Check-out after visit (close encounter)

2. **Vitals Recording** (Nurse)
   - Record: Height, Weight, BP, Temperature, Heart Rate
   - Note allergies, current medications
   - Assign patient to doctor

3. **Consultation** (Doctor)
   - View patient history & current vitals
   - Record observations, diagnosis
   - Prescribe medications
   - Request lab tests
   - Request referrals (to another doctor)

4. **Laboratory** (Lab Technician)
   - View requested tests for patient
   - Record results (text or file upload)
   - Mark as pending if results take >24 hours
   - Notify doctor when completed

5. **Pharmacy** (Pharmacist)
   - View doctor's prescriptions
   - Check for drug interactions/allergies
   - Dispense medications
   - Record price
   - Generate external prescription if drug unavailable
   - Confirm payment status from cashier

6. **Payment** (Cashier)
   - View total due (from prescriptions)
   - Record payment
   - Mark as paid

7. **Visit Closure** (Receptionist)
   - Close the encounter/visit after patient collects drugs

### Key Features

- Role-based access control (custom user model with roles)
- Patient registration with Hospital ID generation
- Encounter (visit) tracking
- Vitals recording
- Doctor observations, prescriptions, lab requests, referrals
- Lab result attachment (pending/completed status)
- Pharmacy dispensing & interaction checks (basic)
- Payment tracking & confirmation
- Responsive design (Bootstrap 5 + HTMX for interactivity)
- File uploads for lab results
- Encrypted sensitive fields (e.g. National ID)

### Technology Stack

- Backend: Django 5.x / 6.x
- Database: PostgreSQL
- Frontend: Django Templates + Bootstrap 5 + HTMX
- Authentication: Custom User model with roles
- Security: CSRF protection, role-based permissions
- Future potential: Celery for background tasks, FHIR integration, reporting

### Current Status (as of March 2026)

- Project structure established
- Custom User model with roles implemented
- PostgreSQL database connected
- Basic admin interface working
- Next steps: Patient model, Encounter model, role-specific dashboards, forms & views for each workflow stage

### Setup Instructions

1. Clone the repository
2. Create & activate virtual environment
   ```bash
   python -m venv venv
   venv\\Scripts\\activate   # Windows
   ```
3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
4. Configure PostgreSQL database in `settings.py`
5. Apply migrations
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Create superuser
   ```bash
   python manage.py createsuperuser
   ```
7. Run development server
   ```bash
   python manage.py runserver
   ```

### Security & Compliance Notes

This is currently a **prototype / learning project**.  
For real clinical use, it must undergo:

- Full security audit
- Data encryption at rest & in transit
- Audit logging
- HIPAA/GDPR-like compliance (Ghana health data regulations)
- Proper access controls & consent mechanisms

### License

MIT License 

### Contact / Maintainer


Avexjoe
---
Last updated: March 2026
