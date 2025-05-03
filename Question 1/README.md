# Clinic Database Management System

## Objective

Design and implement a full-featured relational database for a **Clinic Booking System** using MySQL.

## Use Case

A Kenyan clinic requires a database to track its patients, doctors, appointments, medical records, and prescriptions. The database is structured to ensure data integrity and support the core operations of a modern healthcare facility.

---

## Features

- **Well-structured relational database**: All tables use proper data types and constraints
- **Relationships**: Demonstrates 1-1, 1-M, and M-M relationships
- **Data Integrity**: Uses primary keys, foreign keys, unique, and not null constraints
- **Sample Data Included**: Ready to populate for testing or demonstration

---

## Database Overview

The system includes the following core entities and relationships:

- **Counties**: Kenyan counties — referenced by both patients and doctors
- **Specialties**: Medical specialties for doctor expertise
- **Patients**: Core info, location, and gender
- **Doctors**: Licensed clinicians tied to specialties and counties
- **Medical Records**: One-to-one with patients, with blood type and allergy info
- **Appointments**: Connects patients and doctors at specific times
- **Medications**: Drug information
- **Prescriptions**: Many-to-many relationship between appointments and medications, includes dosage

---


## Getting Started

1. **Clone this Repository**
   ```bash
   git clone https://github.com/MachFrum/Week-8-Database-Assignment.git
   ```

2. **Import the Database**
   - Open MySQL Workbench or your preferred MySQL command line tool.
   - Use the provided `clinic.sql` file:
     ```sql
     SOURCE path/to/clinic.sql;
     ```

---

## File Structure

```
clinic/
  └── clinic.sql    # Contains CREATE TABLE statements and INSERT sample data
  └── README.md     # Project documentation
```

---

## Key SQL Features

- **Primary Keys (PK)** and **Foreign Keys (FK)**
- **UNIQUE** and **NOT NULL** constraints
- **ONE-TO-ONE**, **ONE-TO-MANY**, and **MANY-TO-MANY** relationships
- **Indexes** on foreign keys for performance

---

## Sample Data

Sample entries are provided for:

- Counties: Nairobi, Mombasa, Kisumu, Nakuru
- Specialties: General Practice, Pediatrics, ENT, Dermatology
- Sample medications
- Sample doctors and patients with actual dates and relationships
- Appointments and prescriptions with random but meaningful data

---

## Author

- Peter Macharia
- For academic/demonstration purposes

---
