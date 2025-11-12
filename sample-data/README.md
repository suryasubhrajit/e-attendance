# Sample Import Data

This folder contains sample CSV files for bulk importing teachers and students into the KMBB Attendance System.

## Files

### 1. teachers-import.csv
Contains 13 sample teachers with the following fields:
- **Full Name**: Full name of the teacher
- **Employee ID**: Unique employee ID (EMP001-EMP013)
- **Email**: Official email address
- **Phone**: Contact number (format: +91 XXXXXXXXXX)
- **Department**: Department code (cse, me, ee, ce, ece)
- **Designation**: Professor/Associate Professor/Assistant Professor
- **Qualification**: Educational qualification
- **Experience Years**: Years of teaching experience
- **Specialization**: Area of expertise
- **Date of Joining**: Joining date (YYYY-MM-DD)
- **Address**: Residential address

**Departments covered:**
- Computer Science Engineering (4 teachers)
- Mechanical Engineering (3 teachers)
- Electrical Engineering (2 teachers)
- Civil Engineering (2 teachers)
- Electronics & Communication Engineering (2 teachers)

### 2. students-import.csv
Contains 30 sample students with the following fields:
- **Full Name**: Full name of the student
- **Roll Number**: Unique roll number (format: YYYYDEPTXXX, e.g., 2024CSE001)
- **Email**: Student email address
- **Phone**: Contact number (format: +91 XXXXXXXXXX)
- **Department**: Department code (cse, me, ee, ce, ece)
- **Semester**: Current semester (1-8)
- **Batch**: Academic batch (YYYY-YYYY format, e.g., 2024-2028)
- **Section**: Section (A, B, C, or D)
- **Father Name**: Father's name
- **Mother Name**: Mother's name
- **Blood Group**: Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Category**: Category (General, OBC, SC, ST, EWS)
- **Address**: Residential address
- **Admission Year**: Year of admission (YYYY)

**Distribution:**
- Computer Science Engineering: 10 students
- Mechanical Engineering: 5 students
- Electrical Engineering: 5 students
- Civil Engineering: 5 students
- Electronics & Communication Engineering: 5 students

**Semester Distribution:**
- 3rd Semester: 17 students (2024-2028 batch)
- 5th Semester: 11 students (2023-2027 batch)
- 7th Semester: 2 students (2022-2026 batch)

## How to Use

### Import Teachers
1. Go to Admin Dashboard → Manage Users
2. Click "Import Teachers" button
3. Upload `teachers-import.csv`
4. Review and confirm import

### Import Students
1. Go to Admin Dashboard → Manage Users
2. Switch to "Students" tab
3. Click "Import Students" button
4. Upload `students-import.csv`
5. Review and confirm import

## Default Passwords

### Teachers
Format: `EmployeeID@123`
- Example: EMP001@123, EMP002@123, etc.

### Students
Format: `RollNumber@123`
- Example: 2024CSE001@123, 2024ME001@123, etc.

## Notes

- All email addresses use the domain `@kmbb.in`
- Phone numbers are in the format `+91 XXXXXXXXXX`
- Department codes are lowercase: cse, me, ee, ce, ece
- Roll numbers follow format: YYYYDEPTXXX (e.g., 2024CSE001)
- Employee IDs follow format: EMPXXX (e.g., EMP001)
- All data is randomly generated for demonstration purposes
- Students are distributed across different semesters and sections
- Blood groups and categories are varied for realistic data

## Converting to Excel

To convert CSV to Excel format:
1. Open the CSV file in Microsoft Excel or Google Sheets
2. Save as `.xlsx` format
3. Use the Excel file for import

Or use the provided Excel files if available.

## Field Requirements

### Required Fields for Teachers:
- Full Name
- Employee ID
- Email
- Phone
- Department
- Designation

### Required Fields for Students:
- Full Name
- Roll Number
- Email
- Phone
- Department
- Semester
- Batch
- Section

All other fields are optional but recommended for complete profiles.
