'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap,
  UserPlus,
  Users,
  Calendar,
  Clock,
  Building,
  Award,
  Upload,
  Eye
} from 'lucide-react'
import { getDepartmentOptions, getSemesterOptions, getBatchOptions } from '@/data/departments'
import { ExcelImport } from '@/components/ExcelImport'
import { useNotification } from '@/components/Notification'
import { AttendanceHistory } from '@/components/AttendanceHistory'
import { Modal } from '@/components/ui/modal'

export default function TeacherStudentManagement() {
  const [selectedClass, setSelectedClass] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const { addNotification, NotificationContainer } = useNotification()
  
  // State for students and classes from database
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    semester: '',
    batch: '',
    section: '',
    fatherName: '',
    bloodGroup: '',
    category: '',
    department: ''
  })

  // Mock teacher data
  const teacherInfo = {
    name: "Dr. Priya Sharma",
    employeeId: "EMP001",
    department: "Computer Science Engineering"
  }

  // Load data from database
  useEffect(() => {
    loadClasses()
    loadStudents()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      if (data.classes) {
        setClasses(data.classes.map(cls => ({
          id: cls.id,
          code: cls.code,
          name: cls.name,
          semester: cls.semester,
          batch: cls.batch,
          students: cls._count?.students || 0
        })))
        
        // Set 'all' as default to show all students
        if (!selectedClass) {
          setSelectedClass('all')
        }
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      addNotification('error', 'Failed to load classes')
    }
  }

  const loadStudents = async () => {
    try {
      setLoading(true)
      // If selectedClass is 'all', fetch all students, otherwise filter by class
      const url = (selectedClass && selectedClass !== 'all') 
        ? `/api/students?classId=${selectedClass}` 
        : '/api/students'
      
      console.log('Fetching students from:', url)
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('Students API response:', data)
      console.log('Number of students received:', data.students?.length || 0)
      
      if (data.students) {
        const formattedStudents = data.students.map(student => ({
          id: student.id,
          name: student.user.name,
          rollNo: student.rollNo,
          email: student.user.email,
          phone: student.phone || '',
          semester: student.semester,
          batch: student.batch,
          section: student.section,
          class: selectedClass,
          department: student.department,
          departmentCode: student.departmentCode,
          fatherName: student.fatherName || '',
          motherName: student.motherName || '',
          bloodGroup: student.bloodGroup || '',
          category: student.category || 'General',
          enrolledClasses: student.classes?.length || 0
        }))
        console.log('Formatted students:', formattedStudents)
        setStudents(formattedStudents)
      } else {
        console.warn('No students data in response')
        setStudents([])
      }
    } catch (error) {
      console.error('Error loading students:', error)
      addNotification('error', 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }



  const handleAddStudent = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!newStudent.name.trim()) {
      addNotification('error', 'Please enter the student name!')
      return
    }
    
    if (!newStudent.rollNo.trim()) {
      addNotification('error', 'Please enter the roll number!')
      return
    }
    
    if (!newStudent.email.trim()) {
      addNotification('error', 'Please enter the email address!')
      return
    }
    
    if (!newStudent.phone.trim()) {
      addNotification('error', 'Please enter the phone number!')
      return
    }
    
    if (!newStudent.semester) {
      addNotification('error', 'Please select a semester!')
      return
    }
    
    if (!newStudent.batch.trim()) {
      addNotification('error', 'Please enter the batch!')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newStudent.email)) {
      addNotification('error', 'Please enter a valid email address!')
      return
    }

    // Validate phone number
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(newStudent.phone)) {
      addNotification('error', 'Please enter a valid phone number!')
      return
    }

    try {
      const selectedClassInfo = classes.find(cls => cls.id === selectedClass)
      
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStudent,
          classId: selectedClass,
          department: getDepartmentName(newStudent.department || 'cse'),
          departmentCode: (newStudent.department || 'cse').toUpperCase()
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Reload students to show the new addition
        await loadStudents()
        
        setShowAddForm(false)
        setNewStudent({
          name: '',
          rollNo: '',
          email: '',
          phone: '',
          semester: '',
          batch: '',
          section: '',
          fatherName: '',
          bloodGroup: '',
          category: '',
          department: ''
        })
        
        addNotification('success', `Student "${newStudent.name}" added successfully to ${selectedClassInfo?.name}! Password: ${data.defaultPassword}`)
      } else {
        addNotification('error', data.error || 'Failed to add student')
      }
    } catch (error) {
      console.error('Error adding student:', error)
      addNotification('error', 'Failed to add student. Please try again.')
    }
  }

  const handleBulkImport = async (importedData) => {
    console.log('Bulk import students to class:', selectedClass, importedData)
    
    try {
      // Validate imported data
      if (!importedData || importedData.length === 0) {
        addNotification('error', 'No valid data to import!')
        return
      }

      // Don't allow import to "All Students" - must select a specific class
      if (selectedClass === 'all') {
        addNotification('error', 'Please select a specific class before importing students!')
        return
      }

      const selectedClassInfo = classes.find(cls => cls.id === selectedClass)
      console.log('Processing import for class:', selectedClassInfo?.name)
      console.log('Import data:', importedData)
      
      const response = await fetch('/api/students/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: importedData,
          classId: selectedClass !== 'all' ? selectedClass : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Reload students to show the imported ones
        await loadStudents()
        
        // Close import modal and show success
        setShowBulkImport(false)
        
        const successCount = data.results?.success?.length || 0
        const errorCount = data.results?.errors?.length || 0
        
        if (successCount > 0) {
          addNotification('success', `Successfully imported ${successCount} students to ${selectedClassInfo?.name}! Students are now visible in the list below.`)
        }
        
        if (errorCount > 0) {
          addNotification('warning', `${errorCount} students could not be imported. Check console for details.`)
          console.log('Import errors:', data.results.errors)
        }
        
      } else {
        addNotification('error', data.error || 'Failed to import students')
      }
      
    } catch (error) {
      console.error('Import error:', error)
      addNotification('error', 'Failed to import students. Please try again.')
    }
  }

  // Helper function to get department full name
  const getDepartmentName = (deptCode) => {
    const deptMap = {
      'cse': 'Computer Science Engineering',
      'me': 'Mechanical Engineering', 
      'ee': 'Electrical Engineering',
      'ce': 'Civil Engineering',
      'ece': 'Electronics & Communication Engineering'
    }
    return deptMap[deptCode.toLowerCase()] || 'Computer Science Engineering'
  }

  const handleEditStudent = (student) => {
    setEditingStudent({
      id: student.id,
      phone: student.phone || '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      bloodGroup: student.bloodGroup || '',
      category: student.category || 'General',
      // Read-only fields for display
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
      semester: student.semester,
      batch: student.batch,
      section: student.section,
      department: student.department
    })
    setShowEditForm(true)
  }

  const handleUpdateStudent = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: editingStudent.phone,
          fatherName: editingStudent.fatherName,
          motherName: editingStudent.motherName,
          bloodGroup: editingStudent.bloodGroup,
          category: editingStudent.category
        })
      })

      const data = await response.json()

      if (response.ok) {
        await loadStudents()
        setShowEditForm(false)
        setEditingStudent(null)
        addNotification('success', 'Student information updated successfully!')
      } else {
        addNotification('error', data.error || 'Failed to update student')
      }
    } catch (error) {
      console.error('Error updating student:', error)
      addNotification('error', 'Failed to update student. Please try again.')
    }
  }

  const handleRemoveStudent = (id, name) => {
    if (confirm(`Are you sure you want to remove ${name} from this class?`)) {
      console.log('Removing student from class:', id)
      // Here you would typically update database
      alert('Student removed from class successfully!')
    }
  }

  const filteredStudents = students.filter(student =>
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const selectedClassInfo = classes.find(cls => cls.id === selectedClass)

  return (
    <>
      <NotificationContainer />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">KMBB CET</h1>
                <p className="text-sm text-gray-500">Student Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{teacherInfo.name}</p>
                <p className="text-xs text-gray-500">{teacherInfo.employeeId}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Teacher Panel</h2>
            <nav className="space-y-2">
              <a
                href="/teacher/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <BookOpen className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a
                href="/teacher/attendance"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Clock className="w-5 h-5" />
                <span>Mark Attendance</span>
              </a>
              <a
                href="/teacher/students"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
              >
                <Users className="w-5 h-5" />
                <span>Manage Students</span>
              </a>
              <a
                href="/teacher/schedule"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Calendar className="w-5 h-5" />
                <span>My Schedule</span>
              </a>
              <a
                href="/teacher/reports"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Clock className="w-5 h-5" />
                <span>Attendance Reports</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Class Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
            <CardDescription>Choose a class to manage students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* All Students Option */}
              <div
                onClick={() => setSelectedClass('all')}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedClass === 'all'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">All Students</h4>
                <p className="text-sm text-gray-500">View all students</p>
                <p className="text-sm text-gray-500">All departments</p>
                <p className="text-sm font-medium text-blue-600">{students.length} students</p>
              </div>
              
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedClass === cls.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{cls.name}</h4>
                  <p className="text-sm text-gray-500">{cls.code}</p>
                  <p className="text-sm text-gray-500">{cls.semester} • {cls.batch}</p>
                  <p className="text-sm font-medium text-blue-600">{cls.students} students</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>
                    {selectedClass === 'all' 
                      ? 'All Students' 
                      : `Students in ${selectedClassInfo?.name}`}
                  </span>
                </CardTitle>
                <CardDescription>
                  {selectedClass === 'all'
                    ? 'Viewing all students across all classes and departments'
                    : `Manage students for ${selectedClass} - ${selectedClassInfo?.semester} Semester`}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowAddForm(true)}
                  disabled={selectedClass === 'all'}
                  title={selectedClass === 'all' ? 'Select a specific class to add students' : ''}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
                <Button 
                  onClick={() => setShowBulkImport(true)}
                  disabled={selectedClass === 'all'}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={selectedClass === 'all' ? 'Select a specific class to import students' : ''}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Students
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Bulk Import Students */}
            {showBulkImport && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Import Students to {selectedClassInfo?.name}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBulkImport(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </Button>
                </div>
                
                {/* Class Selection Warning */}
                {selectedClass === 'all' ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                    <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
                      ⚠️ Cannot import to "All Students"
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      Please select a specific class from the list above before importing students.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Target Class:</strong> Students will be imported to <strong>{selectedClassInfo?.name || selectedClass}</strong>
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Make sure you have selected the correct class above before importing.
                    </p>
                  </div>
                )}

                {/* Quick Help */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    <strong>Quick Start:</strong> Download the template, fill with your student data, and upload the CSV file.
                  </p>
                </div>
                <ExcelImport 
                  type="students" 
                  onImportComplete={handleBulkImport}
                />
                
                {/* Debug Test Button */}
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                    <strong>Test Import:</strong> Click below to test the import functionality with sample data
                  </p>
                  <Button 
                    onClick={() => {
                      const sampleData = [
                        {
                          'Full Name': 'Test Student 1',
                          'Roll Number': '2024CSE999',
                          'Email': 'test1@kmbb.in',
                          'Phone': '+91 9999999999',
                          'Department': 'cse',
                          'Semester': '1',
                          'Batch': '2024-2028',
                          'Section': 'A'
                        }
                      ]
                      handleBulkImport(sampleData)
                    }}
                    variant="outline"
                    size="sm"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    Test Import with Sample Data
                  </Button>
                </div>
              </div>
            )}

            {/* Edit Student Form */}
            {showEditForm && editingStudent && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Edit Student Information
                </h3>
                
                {/* Read-only Information */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Student Details (Read-only)</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{editingStudent.name}</span></div>
                    <div><span className="text-gray-600">Roll No:</span> <span className="font-medium">{editingStudent.rollNo}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="font-medium">{editingStudent.email}</span></div>
                    <div><span className="text-gray-600">Semester:</span> <span className="font-medium">{editingStudent.semester}</span></div>
                    <div><span className="text-gray-600">Batch:</span> <span className="font-medium">{editingStudent.batch}</span></div>
                    <div><span className="text-gray-600">Department:</span> <span className="font-medium">{editingStudent.department}</span></div>
                  </div>
                </div>

                <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={editingStudent.phone}
                      onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={editingStudent.bloodGroup}
                      onChange={(e) => setEditingStudent({...editingStudent, bloodGroup: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter father's name"
                      value={editingStudent.fatherName}
                      onChange={(e) => setEditingStudent({...editingStudent, fatherName: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter mother's name"
                      value={editingStudent.motherName}
                      onChange={(e) => setEditingStudent({...editingStudent, motherName: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editingStudent.category}
                      onChange={(e) => setEditingStudent({...editingStudent, category: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setShowEditForm(false)
                      setEditingStudent(null)
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Update Student
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Add Student Form */}
            {showAddForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add Student to {selectedClassInfo?.name}
                </h3>
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter student name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter roll number"
                      value={newStudent.rollNo}
                      onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester
                    </label>
                    <select
                      value={newStudent.semester}
                      onChange={(e) => setNewStudent({...newStudent, semester: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value="1st">1st Semester</option>
                      <option value="2nd">2nd Semester</option>
                      <option value="3rd">3rd Semester</option>
                      <option value="4th">4th Semester</option>
                      <option value="5th">5th Semester</option>
                      <option value="6th">6th Semester</option>
                      <option value="7th">7th Semester</option>
                      <option value="8th">8th Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter batch (e.g., 2021-2025)"
                      value={newStudent.batch}
                      onChange={(e) => setNewStudent({...newStudent, batch: e.target.value})}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Student
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Students List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading students...</p>
                </div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.rollNo}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">{student.semester} Semester</p>
                      <p className="text-sm text-gray-500">{student.batch}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student)
                          setShowHistory(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        History
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveStudent(student.id, student.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No students found in this class</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowAddForm(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add First Student
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance History Modal */}
        <Modal
          isOpen={showHistory}
          onClose={() => {
            setShowHistory(false)
            setSelectedStudent(null)
          }}
          title="Student Attendance History"
          size="xl"
        >
          {selectedStudent && (
            <AttendanceHistory 
              studentId={selectedStudent.id}
              studentName={`${selectedStudent.name} (${selectedStudent.rollNo})`}
            />
          )}
        </Modal>
        </div>
      </div>
    </div>
    </>
  )
}