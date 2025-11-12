import { departments } from '@/data/departments'

export const generateStudentTemplate = () => {
  return [
    {
      'Full Name': 'John Doe',
      'Roll Number': '2024CSE001',
      'Email': 'john.doe@kmbb.in',
      'Phone': '+91 9876543210',
      'Department': 'cse',
      'Semester': '1',
      'Batch': '2024-2028',
      'Section': 'A',
      'Father Name': 'Robert Doe',
      'Mother Name': 'Mary Doe',
      'Blood Group': 'B+',
      'Category': 'General',
      'Address': '123 Main Street, Khordha, Odisha',
      'Admission Year': '2024'
    },
    {
      'Full Name': 'Jane Smith',
      'Roll Number': '2024ME001',
      'Email': 'jane.smith@kmbb.in',
      'Phone': '+91 9876543211',
      'Department': 'me',
      'Semester': '1',
      'Batch': '2024-2028',
      'Section': 'A',
      'Father Name': 'Michael Smith',
      'Mother Name': 'Sarah Smith',
      'Blood Group': 'A+',
      'Category': 'OBC',
      'Address': '456 Oak Avenue, Khordha, Odisha',
      'Admission Year': '2024'
    },
    {
      'Full Name': 'Raj Patel',
      'Roll Number': '2024EE001',
      'Email': 'raj.patel@kmbb.in',
      'Phone': '+91 9876543212',
      'Department': 'ee',
      'Semester': '1',
      'Batch': '2024-2028',
      'Section': 'B',
      'Father Name': 'Kishore Patel',
      'Mother Name': 'Priya Patel',
      'Blood Group': 'O+',
      'Category': 'General',
      'Address': '789 Pine Road, Khordha, Odisha',
      'Admission Year': '2024'
    }
  ]
}

export const generateTeacherTemplate = () => {
  return [
    {
      'Full Name': 'Dr. Sarah Wilson',
      'Employee ID': 'EMP001',
      'Email': 'sarah.wilson@kmbb.in',
      'Phone': '+91 9876543212',
      'Department': 'cse',
      'Designation': 'Associate Professor',
      'Qualification': 'Ph.D. Computer Science',
      'Experience Years': '8',
      'Specialization': 'Machine Learning, Data Science',
      'Date of Joining': '2020-08-15',
      'Address': '123 Faculty Colony, Khordha, Odisha'
    },
    {
      'Full Name': 'Prof. David Brown',
      'Employee ID': 'EMP002',
      'Email': 'david.brown@kmbb.in',
      'Phone': '+91 9876543213',
      'Department': 'me',
      'Designation': 'Professor',
      'Qualification': 'Ph.D. Mechanical Engineering',
      'Experience Years': '12',
      'Specialization': 'Thermodynamics, Heat Transfer',
      'Date of Joining': '2018-07-01',
      'Address': '456 Faculty Colony, Khordha, Odisha'
    },
    {
      'Full Name': 'Dr. Priya Sharma',
      'Employee ID': 'EMP003',
      'Email': 'priya.sharma@kmbb.in',
      'Phone': '+91 9876543214',
      'Department': 'ee',
      'Designation': 'Assistant Professor',
      'Qualification': 'Ph.D. Electrical Engineering',
      'Experience Years': '6',
      'Specialization': 'Power Systems, Renewable Energy',
      'Date of Joining': '2021-06-01',
      'Address': '789 Faculty Colony, Khordha, Odisha'
    }
  ]
}

export const getFieldValidationRules = (type) => {
  if (type === 'students') {
    return {
      required: ['Full Name', 'Roll Number', 'Email', 'Phone', 'Department', 'Semester', 'Batch', 'Section'],
      optional: ['Father Name', 'Mother Name', 'Blood Group', 'Category', 'Address', 'Admission Year'],
      formats: {
        'Email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Phone': /^[\+]?[0-9\s\-\(\)]{10,}$/,
        'Roll Number': /^[0-9]{4}[A-Z]{2,3}[0-9]{3}$/
      },
      enums: {
        'Department': departments.map(d => d.id),
        'Semester': ['1', '2', '3', '4', '5', '6', '7', '8'],
        'Blood Group': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'Category': ['General', 'OBC', 'SC', 'ST', 'EWS'],
        'Section': ['A', 'B', 'C', 'D']
      }
    }
  } else {
    return {
      required: ['Full Name', 'Employee ID', 'Email', 'Phone', 'Department', 'Designation'],
      optional: ['Qualification', 'Experience Years', 'Specialization', 'Date of Joining', 'Address'],
      formats: {
        'Email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Phone': /^[\+]?[0-9\s\-\(\)]{10,}$/,
        'Employee ID': /^[A-Z]{3}[0-9]{3}$/
      },
      enums: {
        'Department': departments.map(d => d.id),
        'Designation': ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Lab Assistant']
      }
    }
  }
}

export const validateImportData = (data, type) => {
  const rules = getFieldValidationRules(type)
  const results = {
    valid: [],
    invalid: [],
    duplicates: [],
    warnings: []
  }
  
  const seenIds = new Set()
  const idField = type === 'students' ? 'Roll Number' : 'Employee ID'
  
  data.forEach((row, index) => {
    const errors = []
    const warnings = []
    
    // Check required fields
    rules.required.forEach(field => {
      if (!row[field]?.toString().trim()) {
        errors.push(`${field} is required`)
      }
    })
    
    // Check formats
    Object.entries(rules.formats).forEach(([field, regex]) => {
      const value = row[field]?.toString().trim()
      if (value && !regex.test(value)) {
        errors.push(`Invalid ${field} format`)
      }
    })
    
    // Check enums
    Object.entries(rules.enums).forEach(([field, validValues]) => {
      const value = row[field]?.toString().trim()
      if (value && !validValues.includes(value)) {
        errors.push(`Invalid ${field}. Must be one of: ${validValues.join(', ')}`)
      }
    })
    
    // Check for duplicates
    const id = row[idField]?.toString().trim()
    if (id) {
      if (seenIds.has(id)) {
        errors.push(`Duplicate ${idField}`)
        results.duplicates.push({ row: index + 1, id })
      } else {
        seenIds.add(id)
      }
    }
    
    // Add warnings for missing optional fields
    rules.optional.forEach(field => {
      if (!row[field]?.toString().trim()) {
        warnings.push(`${field} is empty`)
      }
    })
    
    const result = { row: index + 1, data: row }
    
    if (errors.length > 0) {
      result.errors = errors
      results.invalid.push(result)
    } else {
      results.valid.push(result)
    }
    
    if (warnings.length > 0) {
      result.warnings = warnings
      results.warnings.push(result)
    }
  })
  
  return results
}

export const convertToCSV = (data) => {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || ''
      // Escape commas and quotes
      return `"${value.toString().replace(/"/g, '""')}"`
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}

export const mapCSVToAPIFormat = (data, type) => {
  if (type === 'students') {
    return data.map(row => ({
      name: row['Full Name'],
      rollNo: row['Roll Number'],
      email: row['Email'],
      phone: row['Phone'],
      department: row['Department'],
      departmentCode: row['Department']?.toUpperCase(),
      semester: row['Semester'],
      batch: row['Batch'],
      section: row['Section'],
      fatherName: row['Father Name'],
      motherName: row['Mother Name'],
      bloodGroup: row['Blood Group'],
      category: row['Category'],
      address: row['Address'],
      admissionYear: row['Admission Year']
    }))
  } else {
    return data.map(row => ({
      name: row['Full Name'],
      employeeId: row['Employee ID'],
      email: row['Email'],
      phone: row['Phone'],
      department: row['Department'],
      designation: row['Designation']
    }))
  }
}

export const downloadTemplate = (type) => {
  const template = type === 'students' ? generateStudentTemplate() : generateTeacherTemplate()
  const csvContent = convertToCSV(template)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${type}_import_template.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}