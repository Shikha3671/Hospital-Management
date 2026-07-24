CREATE DATABASE IF NOT EXISTS smart_hospital;
USE smart_hospital;

DROP TABLE IF EXISTS Prescriptions;
DROP TABLE IF EXISTS Medical_Records;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Admin;

CREATE TABLE Admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_email (email),
    INDEX idx_admin_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_departments_name (department_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NULL,
    specialty VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    experience_years INT DEFAULT 0,
    status ENUM('available','on_leave','busy') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctors_department
        FOREIGN KEY (department_id) REFERENCES Departments(department_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_doctors_department (department_id),
    INDEX idx_doctors_specialty (specialty),
    INDEX idx_doctors_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NULL,
    date_of_birth DATE NULL,
    gender ENUM('Male','Female','Other') NULL,
    address VARCHAR(255) NULL,
    emergency_contact VARCHAR(15) NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_patients_email (email),
    INDEX idx_patients_phone (phone),
    INDEX idx_patients_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled','completed','cancelled','pending') DEFAULT 'scheduled',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_patient
        FOREIGN KEY (patient_id) REFERENCES Patients(patient_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_appointments_doctor
        FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_appointments_department
        FOREIGN KEY (department_id) REFERENCES Departments(department_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_appointments_patient (patient_id),
    INDEX idx_appointments_doctor (doctor_id),
    INDEX idx_appointments_department (department_id),
    INDEX idx_appointments_date (appointment_date),
    INDEX idx_appointments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    medication_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration_days INT NOT NULL,
    instructions TEXT NULL,
    prescribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prescriptions_appointment
        FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_prescriptions_doctor
        FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_prescriptions_patient
        FOREIGN KEY (patient_id) REFERENCES Patients(patient_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_prescriptions_appointment (appointment_id),
    INDEX idx_prescriptions_doctor (doctor_id),
    INDEX idx_prescriptions_patient (patient_id),
    INDEX idx_prescriptions_date (prescribed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Medical_Records (
    medical_record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    blood_pressure VARCHAR(20) NULL,
    temperature DECIMAL(4,1) NULL,
    weight_kg DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medical_records_patient
        FOREIGN KEY (patient_id) REFERENCES Patients(patient_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_medical_records_doctor
        FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_medical_records_patient (patient_id),
    INDEX idx_medical_records_doctor (doctor_id),
    INDEX idx_medical_records_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Admin (full_name, email, password_hash, phone, status) VALUES
('Alice Johnson', 'alice.admin@hospital.com', '$2a$10$abcdefghijklmnopqrstuv', '555-1001', 'active'),
('Robert Smith', 'robert.admin@hospital.com', '$2a$10$abcdefghijklmnopqrstuv', '555-1002', 'active');

INSERT INTO Departments (department_name, description) VALUES
('Cardiology', 'Heart and cardiovascular care'),
('Neurology', 'Brain and nervous system care'),
('General Medicine', 'General health and routine care');

INSERT INTO Doctors (first_name, last_name, email, phone, specialty, department_id, license_number, experience_years, status) VALUES
('Dr. Maya', 'Patel', 'maya.patel@hospital.com', '555-2001', 'Cardiologist', 1, 'LIC-1001', 12, 'available'),
('Dr. James', 'Wilson', 'james.wilson@hospital.com', '555-2002', 'Neurologist', 2, 'LIC-1002', 9, 'available'),
('Dr. Sara', 'Lee', 'sara.lee@hospital.com', '555-2003', 'General Physician', 3, 'LIC-1003', 7, 'available');

INSERT INTO Patients (first_name, last_name, email, phone, date_of_birth, gender, address, emergency_contact, status) VALUES
('John', 'Doe', 'john.doe@email.com', '555-3001', '1990-05-14', 'Male', '123 Main Street', '555-9001', 'active'),
('Emma', 'Brown', 'emma.brown@email.com', '555-3002', '1987-08-21', 'Female', '456 Oak Avenue', '555-9002', 'active'),
('Chris', 'Taylor', 'chris.taylor@email.com', '555-3003', '1995-02-10', 'Male', '789 Pine Road', '555-9003', 'active');

INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, status, notes) VALUES
(1, 1, 1, '2026-07-25', '09:00:00', 'scheduled', 'Routine cardiac checkup'),
(2, 2, 2, '2026-07-25', '11:30:00', 'scheduled', 'Neurology consultation'),
(3, 3, 3, '2026-07-26', '14:00:00', 'completed', 'Annual medical review'),
(1, 3, 3, '2026-07-27', '10:00:00', 'pending', 'General follow-up');

INSERT INTO Prescriptions (appointment_id, doctor_id, patient_id, medication_name, dosage, frequency, duration_days, instructions) VALUES
(1, 1, 1, 'Aspirin', '100mg', 'Once daily', 7, 'Take after breakfast'),
(2, 2, 2, 'Gabapentin', '300mg', 'Twice daily', 10, 'Take with food'),
(3, 3, 3, 'Vitamin D', '1000IU', 'Once daily', 30, 'Take after dinner');

INSERT INTO Medical_Records (patient_id, doctor_id, diagnosis, notes, blood_pressure, temperature, weight_kg) VALUES
(1, 1, 'Hypertension', 'Patient reports mild headache and fatigue.', '130/85', 37.0, 78.50),
(2, 2, 'Migraine', 'Patient experiences frequent headaches.', '120/80', 36.8, 62.40),
(3, 3, 'General wellness check', 'No major issues reported.', '118/76', 36.7, 70.20);
