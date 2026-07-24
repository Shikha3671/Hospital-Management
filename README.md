# Smart Hospital Management System

A full-stack training project for a Smart Hospital Management System with:
- Node.js + Express backend
- MySQL database
- HTML/CSS/JavaScript frontend
- JWT authentication
- REST APIs for admin, doctors, patients, appointments, and prescriptions

## Project Structure

```text
hospital-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── pages/
│   ├── js/
│   ├── index.html
│   └── styles.css
├── smart_hospital_mysql.sql
└── README.md
```

## Features

### Backend
- MVC structure
- JWT authentication
- bcrypt password hashing
- MySQL integration
- REST APIs
- Error handling

### Frontend
- Home page
- Login page
- Registration page
- Patient dashboard
- Doctor dashboard
- Admin dashboard
- Appointment page
- Patient profile
- Doctor profile
- Contact page

## Requirements

- Node.js
- MySQL
- npm

## Setup

### 1. Database
Create a MySQL database named `smart_hospital` and import the SQL file:

```bash
mysql -u root -p
CREATE DATABASE smart_hospital;
USE smart_hospital;
SOURCE smart_hospital_mysql.sql;
```

### 2. Backend
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Update the `.env` file with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_hospital
DB_PORT=3306
JWT_SECRET=smart_hospital_secret_key
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm start
```

### 3. Frontend
Open the frontend pages directly in a browser, or use a simple static server if needed.

Example:

```bash
cd frontend
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## API Base URL

```text
http://localhost:5000/api
```

## Notes

- The frontend is currently connected to the backend using the Fetch API.
- Authentication is session-based in the browser via localStorage.
- The project is intended for college training and can be expanded further.
