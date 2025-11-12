# Import Instructions

## Quick Start Guide

### Step 1: Prepare Your Data

Use the provided sample files:
- `teachers-import.csv` - 13 teachers
- `students-import.csv` - 30 students

Or create your own following the same format.

### Step 2: Import Teachers

1. **Login as Admin**
   - Go to your site
   - Login with admin credentials

2. **Navigate to User Management**
   - Click "Manage Users" in the sidebar
   - You'll see the Teachers tab by default

3. **Import Teachers**
   - Click the "Import Teachers" button (green button with upload icon)
   - Click "Choose File" or drag and drop `teachers-import.csv`
   - The system will preview the data
   - Click "Import" to confirm

4. **Verify Import**
   - Check the success message
   - Teachers should appear in the list
   - Default passwords are shown in the notification

### Step 3: Import Students

1. **Switch to Students Tab**
   - Click the "Students" tab at the top

2. **Import Students**
   - Click the "Import Students" button
   - Upload `students-import.csv`
   - Review the preview
   - Click "Import" to confirm

3. **Verify Import**
   - Students should appear in the list
   - Check different departments and semesters

## CSV Format Requirements

### Teachers CSV Format
```csv
name,email,employeeId,department,designation,phone,password
Dr. John Doe,john.doe@kmbb.edu.in,EMP001,Computer Science Engineering,Professor,9876543210,EMP001@123
```

**Required Columns:**
- name
- email
- employeeId

**Optional Columns:**
- department (defaults to "Computer Science Engineering")
- designation
- phone
- password (defaults to employeeId@123)

### Students CSV Format
```csv
name,email,rollNo,phone,semester,batch,section,department,departmentCode,fatherName,motherName,bloodGroup,category,address,admissionYear
John Doe,john@student.kmbb.edu.in,CSE2024001,9123456789,3,2024-2028,A,Computer Science Engineering,CSE,Father Name,Mother Name,O+,General,Address,2024
```

**Required Columns:**
- name
- email
- rollNo

**Optional Columns:**
- All other fields (will use defaults if not provided)

## Common Issues & Solutions

### Issue: "Email already exists"
**Solution:** Each email must be unique. Check for duplicates in your CSV.

### Issue: "Employee ID/Roll Number already exists"
**Solution:** Each ID must be unique. Update duplicate IDs in your CSV.

### Issue: "Invalid CSV format"
**Solution:** 
- Ensure first row contains column headers
- Use commas as separators
- Enclose fields with commas in quotes

### Issue: "Some imports failed"
**Solution:** 
- Check the console for detailed error messages
- Fix the problematic rows
- Re-import only the failed entries

## Tips for Success

1. **Test with Small Batch First**
   - Import 2-3 records first to verify format
   - Then import the full list

2. **Keep Backup**
   - Save a copy of your CSV before importing
   - You can re-import if needed

3. **Use Consistent Naming**
   - Follow the same format for all entries
   - Use proper capitalization

4. **Verify Department Names**
   - Use exact department names from the system:
     - Computer Science Engineering
     - Mechanical Engineering
     - Electrical Engineering
     - Civil Engineering
     - Electronics & Communication Engineering

5. **Check Email Format**
   - Teachers: `name@kmbb.edu.in`
   - Students: `name@student.kmbb.edu.in`

## After Import

### Share Login Credentials

Teachers and students can login with:
- **Username:** Their email address
- **Password:** 
  - Teachers: `employeeId@123` (e.g., EMP001@123)
  - Students: `rollNo@123` (e.g., CSE2024001@123)

### Recommend Password Change

Advise all users to change their password after first login.

## Bulk Operations

### Export Current Data
1. Go to User Management
2. Click "Export" button
3. Download CSV of current users
4. Use as template for new imports

### Update Existing Users
Currently, imports only create new users. To update:
1. Edit users individually through the UI
2. Or delete and re-import with updated data

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify CSV format matches the examples
3. Ensure all required fields are present
4. Contact system administrator

---

**Sample Data Provided:**
- ✅ 13 Teachers across 5 departments
- ✅ 30 Students across 5 departments
- ✅ Realistic names, emails, and details
- ✅ Ready to import and test
