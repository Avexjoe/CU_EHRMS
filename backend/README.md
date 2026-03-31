Central University Electronic Health Records (EHR) System

## Project Overview

This is a **web-based Electronic Health Records (EHR) system** designed for a university hospital/clinic serving students and staff alike. This system will be used on three different three independent university campuses (Miosto, Accra, and Kumasi). The system is built using **Django** (Python web framework) and **PostgreSQL** database, focusing on secure, role-based access for hospital staff.

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
   - New patient: Register with Student ID, Ghana Card/NHIS, DOB, address, emergency contacts, multiple birth flag etc.
   - Generate unique **Hospital ID**
   - Check-in frequent patients
   - Check-out after visit (close encounter)

2. **Vitals Recording** (Nurse)
   - Records: Height, Weight, BP, Temperature, Heart Rate
   - Note allergies, current medications
   - Assign patient to doctors

3. **Encounter** (Doctor)
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
   - Close the visit after patient collects and pays for drugs.

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
- Frontend: React, typescript 
- Authentication: Custom User model with roles
- Security: 


### Current Status (as of March 2026)

- Project structure established
- Custom User model with roles implemented
- PostgreSQL database connected (Issues with connection yet to be fixed)
- Next steps: Patient model, Encounter model, role-specific dashboards, forms & views for each workflow stage




---
Avexjoe
---
Last updated: March 2026
