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

### ER Diagram
- erDiagram for use in Mermaid live Editor

User || --o{UserRole : ""
Role || --o{UserRole : ""

Person || --o{Patient : "instance at diff hospitals"

Patient || --o{ContactPoint : "has"
Patient || --o{Address : "has"
Patient || --o{Identifier : "possess"
Patient || --o{Visit : "can have"
Vist || --o{Encounter : "associated with"
Tenant || --o{Patient : "can have"

Patient ||--o{ AllergyIntollerance : "Occurs"
Encounter ||--o{ Observation : "Occurs"
Location ||--o{ Encounter : "Occurs"
Location || --o{BedLocationMap : ""



zlkpBed  || --o{BedLocationMap : ""
zlkpBedType ||--o{ zlkpBed : "References"
zlkpEncounterStatus ||--o{ Encounter : "Has"
zlkpLocationType ||--o{ Location : "Has"
zlkpEncounterPriority ||--o{ Encounter : "Has"
zlkpEncounterType ||--o{ Encounter : "Has"
zlkpIdentifierType || --o{Identifier : ""

zlkpClinicalStatus || --o{AllergyIntollerance : ""
zlkpPatientStatus || --o{Patient : "can have"
zlkpGender || --o{Person : ""
zlkpContactSystem || --o{ContactPoint : ""


Person{
    int PersonID PK
    VARCHAR(50) FamilyName
    VARCHAR(50) GivenName
    VARCHAR(50) MiddleName
    date DateOfBirth
    int GenderID FK
    int TitleID
    bool MultipleBirth
    bool IsDeceased
    date DateOfDeath
}

Patient{
    int PatientID Pk
    int PersonID FK
    GUID TenantID FK
    VARCHAR(20) LocalMRN
    int PatientStatusID FK
}

Tenant{
    GUID TenantID PK
    VARCHAR(50) TenantName
    VARCHAR(20) TenantCode
    bool IsActive
}

Identifier{
    Int IdentifierID Pk
    VARCHAR(50) IdentifierName
    int IdentifierTypeID FK
    VARCHAR(20) IdentifierValue
    bool IsActive
    date EffectiveStartDate
    date EffectiveEndDate
}

 BedLocationMap {
    int BedLocationMapID PK
    int BedID FK
    int LocationID FK
    date EffectiveStartDate
    date EffectiveEndDate
    int BedRowNumber
    int BedColumnNumber

 }

 Visit {
    int VisitID PK
    int PatientID FK
    int VisitTypeID FK
    date VisitDate 
    date VisitEndDate
 }

Encounter {
    int EncounterID Pk
    int VisitID FK
    int LocationID FK
    int EncounterStatusID FK
    datetime PeriodStart
    datetime PeriodEnd
    int EncounterTypeID FK
    int EncounterPriorityID Fk
}


 Location {
    int LocationID Pk
    VARCHAR(20) LocationName
    VARCHAR(10) Code
    int LocationTypeID FK
    date EffectiveStartDate
    date EffectiveEndDate
    bool IsActive
    int DisplayOrder
 }   



 AllergyIntollerance{
    int AllergyID Pk
    int PatientID FK
    int ClinicalStatusID

 }

 Observation {
    int ObservationID Pk
    int EncounterID FK
    int ObservationStatusID
    Date EffectiveStartDate
    date EffectiveEndDate
    VARCHAR(50) ObservedValue
    decimal Quantity
 }

  ContactPoint {
    int ContactPointID Pk
    int PatientID FK
    int ContactSystemID FK
    VARCHAR(50) ContactPointValue
    date EffectiveStartDate
    date EffectiveEndDate
    bool IsActive
    bit IsPreferred
 }

Address {
    int PatientAddressID Pk
    int PatientID FK
    string AddressLine1
    string AddressLine2
    string City
    date EffectiveStartDate
    date EffectiveEndDate
    bool IsCurrent
    int DisplayOrder
 }

 User {
  int UserID PK
  string UserName
  bool IsActive
  date EffectiveStartDate
  date EffectiveEndDate

 }

 Role {
    int RoleID PK
    string RoleName
 }

 UserRole {
    int UserID FK
    int RoleID FK
 }

   zlkpLocationType {
      int LocationTypeID
      VARCHAR(20) LocationTypeName
      int DisplayOrder
      bool IsActive
  }

  zlkpGender{
    int GenderID PK
    VARCHAR(20) GenderName
    VARCHAR(10) Code
    bit IsActive
}

zlkpPatientStatus{
    int PatientStatusID PK
    VARCHAR(20) PatientStatusName
    VARCHAR(10) StatusCode 
    bool IsActive
}


zlkpClinicalStatus{
    int ClinicalStatusID
    VARCHAR(20) ClinicalStatusName
    VARCHAR(10) Code
    int DisplayOrder
}

zlkpIdentifierType{
    int IdentifierTypeID PK
    VARCHAR(20) IdentifierType
    bool IsActive
    int DisplayOrder
}


zlkpBedType {
    int BedTypeID Pk
    VARCHAR(50) BedType
    bool IsActive
    int DisplayOrder
}

 zlkpVisitType{
    int VisitTypeID PK
    VARCHAR(50) VisitTypeName 
    VARCHAR(20) VisitTypeCode
    bool IsActive
    int DisplayOrder

 }

  zlkpContactSystem{
    int ContactSystemID PK
    VARCHAR(20) ContactSystem
    bit IsActive
    int DisplayOrder
 }

 
zlkpEncounterType{
    int EncounterTypeID PK
    VARCHAR(20) EncounterType
    bool IsActive
    int DisplayOrder

}

zlkpEncounterPriority{
    int EncounterPriorityID Pk
    VARCHAR(15) Priority
    bool IsActive
    int DisplayOrder
}

zlkpEncounterStatus{
    int EncounterStatusID Pk
    VARCHAR(20) EncounterStatus
    VARCHAR(500) Definition
    bool IsActive
    int DisplayOrder
}

zlkpBed {
    int BedID Pk
    VARCHAR(10) BedNumber
    VARCHAR(10) Code
    int BedTypeID FK
}



---
Avexjoe
---
Last updated: March 2026
