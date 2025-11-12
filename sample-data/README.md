# Sample Import Data

This folder contains sample CSV files for bulk importing teachers and students into the KMBB Attendance System.

## Files

### 1. teachers-import.csv
Contains 13 sample teachers with the following fields:
- **name**: Full name of the teacher
- **email**: Official email address
- **employeeId**: Unique employee ID (EMP001-EMP013)
- **department**: Department name (CSE, ME, EE, CE, ECE)
- **designation**: Professor/Associate Professor/Assistant Professor
- **phone**: Contact number
- **password**: Default password (employeeId@123)

**Departments covered:**
- Computer Science Engineering (4 teachers)
- Mechanical Engineering (3 teachers)
- Electrical Engineering (2 teachers)
- Civil Engineering (2 teachers)
- Electronics & Communication Engineering (2 teachers)

### 2. students-import.csv
Contains 30 sample students with the following fields:
- **name**: Full name of the student
- **email**: Student email address
- **rollNo**: Unique roll number (format: DEPT2024XXX)
- **phone**: Contact number
- **semester**: Current semester (3, 5, or 7)
- **batch**: Academic batch (2024-2028, 2023-2027, 2022-2026)
- **section**: Section (A or B)
- **department**: Full department name
- **departmentCode**: Department code (CSE, ME, EE, CE, ECE)
- **fatherName**: Father's name
- **motherName**: Mother's name
- **bloodGroup**: Blood group (A+, B+, O+, AB+, etc.)
- **category**: Category (General, OBC, SC, ST, EWS)
- **address**: Residential address
- **admissionYear**: Year of admission

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
Format: `employeeId@123`
- Example: EMP001@123, EMP002@123, etc.

### Students
Format: `rollNo@123`
- Example: CSE2024001@123, ME2024001@123, etc.

## Notes

- All email addresses use the domain `@kmbb.edu.in` for teachers and `@student.kmbb.edu.in` for students
- Phone numbers are in the format 91234567XX
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
- name
- email
- employeeId

### Required Fields for Students:
- name
- email
- rollNo

All other fields are optional but recommended for complete profiles.
