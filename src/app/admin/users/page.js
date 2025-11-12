'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  BookOpen, 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserPlus,
  GraduationCap,
  Shield,
  BarChart3,
  Calendar,
  Building,
  Award,
  Upload
} from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useNotification } from '@/components/Notification'
import { LoadingOverlay } from '@/components/Loading'
import { ExcelImport } from '@/components/ExcelImport'
import { Modal } from '@/components/ui/modal'
import { departments, getDepartmentOptions, getSemesterOptions, getBatchOptions } from '@/data/departments'

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('teachers')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification, NotificationContainer } = useNotification()
  const [newUser, setNewUser] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: '',
    // Student specific fields
    semester: '',
    batch: '',
    section: '',
    admissionYear: '',
    fatherName: '',
    motherName: '',
    address: '',
    bloodGroup: '',
    category: ''
  })

  // State for real database data
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  // Load data from database
  useEffect(() => {
    loadTeachers()
    loadStudents()
  }, [])

  const loadTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      const data = await response.json()
      if (data.teachers) {
        const formattedTeachers = data.teachers.map(teacher => ({
          id: teacher.id,
          name: teacher.user.name,
          employeeId: teacher.employeeId,
          email: teacher.user.email,
          department: teacher.department,
          designation: 'Faculty', // You can add this field to schema if needed
          isHOD: teacher.isHOD || false
        }))
        setTeachers(formattedTeachers)
      }
    } catch (error) {
      console.error('Error loading teachers:', error)
      addNotification('error', 'Failed to load teachers')
    }
  }

  const handleToggleHOD = async (teacherId, isHOD) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/teachers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId, isHOD })
      })

      const data = await response.json()

      if (response.ok) {
        await loadTeachers()
        addNotification('success', `Teacher ${isHOD ? 'marked as HOD' : 'removed from HOD'} successfully!`)
      } else {
        addNotification('error', data.error || 'Failed to update teacher')
      }
    } catch (error) {
      console.error('Error updating teacher:', error)
      addNotification('error', 'Failed to update teacher')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStudents = async () => {
    try {
      setDataLoading(true)
      console.log('Admin: Loading students from /api/students')
      const response = await fetch('/api/students')
      const data = await response.json()
      console.log('Admin: Students API response:', data)
      console.log('Admin: Number of students:', data.students?.length || 0)
      
      if (data.students) {
        const formattedStudents = data.students.map(student => ({
          id: student.id,
          name: student.user.name,
          rollNo: student.rollNo,
          email: student.user.email,
          phone: student.phone || '',
          department: student.department,
          departmentCode: student.departmentCode,
          semester: student.semester,
          batch: student.batch,
          section: student.section,
          fatherName: student.fatherName || '',
          bloodGroup: student.bloodGroup || '',
          category: student.category || 'General'
        }))
        console.log('Admin: Formatted students:', formattedStudents)
        setStudents(formattedStudents)
      } else {
        console.warn('Admin: No students in response')
        setStudents([])
      }
    } catch (error) {
      console.error('Error loading students:', error)
      addNotification('error', 'Failed to load students')
    } finally {
      setDataLoading(false)
    }
  }

  const departmentOptions = getDepartmentOptions()
  const semesterOptions = getSemesterOptions()
  const batchOptions = getBatchOptions()
  
  const categoryOptions = [
    { value: 'General', label: 'General' },
    { value: 'OBC', label: 'OBC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' },
    { value: 'EWS', label: 'EWS' }
  ]
  
  const bloodGroupOptions = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ]

  const handleAddUser = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!newUser.name.trim()) {
      alert('Please enter the full name!')
      return
    }
    
    if (!newUser.employeeId.trim()) {
      alert(`Please enter the ${activeTab === 'teachers' ? 'employee ID' : 'roll number'}!`)
      return
    }
    
    if (!newUser.email.trim()) {
      alert('Please enter the email address!')
      return
    }
    
    if (!newUser.phone.trim()) {
      alert('Please enter the phone number!')
      return
    }
    
    if (!newUser.department) {
      alert('Please select a department!')
      return
    }
    
    // Additional validation for students
    if (activeTab === 'students') {
      if (!newUser.semester) {
        alert('Please select a semester!')
        return
      }
      if (!newUser.batch) {
        alert('Please select a batch!')
        return
      }
      if (!newUser.section.trim()) {
        alert('Please enter a section!')
        return
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      alert('Please enter a valid email address!')
      return
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(newUser.phone)) {
      alert('Please enter a valid phone number!')
      return
    }

    // For teachers, validate designation
    if (activeTab === 'teachers' && !newUser.designation.trim()) {
      addNotification('error', 'Please enter the teacher designation!')
      return
    }

    // Generate password if not provided
    const finalPassword = newUser.password || `${newUser.employeeId}@123`

    setIsLoading(true)
    
    try {
      const apiUrl = activeTab === 'teachers' ? '/api/teachers' : '/api/students'
      const payload = activeTab === 'teachers' 
        ? {
            name: newUser.name,
            email: newUser.email,
            employeeId: newUser.employeeId,
            department: newUser.department,
            designation: newUser.designation,
            phone: newUser.phone,
            password: finalPassword
          }
        : {
            name: newUser.name,
            email: newUser.email,
            rollNo: newUser.employeeId, // Using employeeId field for rollNo
            phone: newUser.phone,
            semester: newUser.semester,
            batch: newUser.batch,
            section: newUser.section,
            department: newUser.department,
            departmentCode: newUser.department.toUpperCase(),
            fatherName: newUser.fatherName,
            motherName: newUser.motherName,
            bloodGroup: newUser.bloodGroup,
            category: newUser.category,
            address: newUser.address,
            admissionYear: newUser.admissionYear || new Date().getFullYear().toString(),
            password: finalPassword
          }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        // Reload the appropriate list
        if (activeTab === 'teachers') {
          await loadTeachers()
        } else {
          await loadStudents()
        }
        
        setShowAddForm(false)
        setNewUser({
          name: '',
          employeeId: '',
          email: '',
          phone: '',
          department: '',
          designation: '',
          password: '',
          semester: '',
          batch: '',
          section: '',
          admissionYear: '',
          fatherName: '',
          motherName: '',
          address: '',
          bloodGroup: '',
          category: ''
        })
        
        addNotification('success', `${activeTab === 'teachers' ? 'Teacher' : 'Student'} "${newUser.name}" added successfully! Login credentials: ${newUser.employeeId} / ${data.defaultPassword}`)
      } else {
        addNotification('error', data.error || 'Failed to add user')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      addNotification('error', 'Failed to add user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkImport = async (importedData) => {
    console.log('Bulk import data:', importedData)
    
    try {
      setIsLoading(true)
      
      if (activeTab === 'students') {
        const response = await fetch('/api/students/bulk-import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            students: importedData
          })
        })

        const data = await response.json()

        if (response.ok) {
          await loadStudents()
          setShowBulkImport(false)
          
          const successCount = data.results?.success?.length || 0
          const errorCount = data.results?.errors?.length || 0
          
          if (successCount > 0) {
            addNotification('success', `Successfully imported ${successCount} students!`)
          }
          
          if (errorCount > 0) {
            addNotification('warning', `${errorCount} students could not be imported. Check console for details.`)
            console.log('Import errors:', data.results.errors)
          }
        } else {
          addNotification('error', data.error || 'Failed to import students')
        }
      } else {
        // Teacher bulk import
        const response = await fetch('/api/teachers/bulk-import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teachers: importedData
          })
        })

        const data = await response.json()

        if (response.ok) {
          await loadTeachers()
          setShowBulkImport(false)
          
          const successCount = data.results?.success?.length || 0
          const errorCount = data.results?.errors?.length || 0
          
          if (successCount > 0) {
            addNotification('success', `Successfully imported ${successCount} teachers!`)
          }
          
          if (errorCount > 0) {
            addNotification('warning', `${errorCount} teachers could not be imported. Check console for details.`)
            console.log('Import errors:', data.results.errors)
          }
        } else {
          addNotification('error', data.error || 'Failed to import teachers')
        }
      }
    } catch (error) {
      console.error('Bulk import error:', error)
      addNotification('error', 'Failed to import data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      console.log('Deleting user:', id)
      // Here you would typically delete from database
      alert('User deleted successfully!')
    }
  }

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const adminInfo = {
    name: "Dr. Rajesh Kumar",
    employeeId: "PRIN001",
    designation: "Principal"
  }

  return (
    <>
      <NotificationContainer />
      <DashboardLayout
        userInfo={adminInfo}
        currentPage="users"
        userType="admin"
        title="KMBB CET"
        subtitle="User Management"
      >
        <div className="p-8">
          <LoadingOverlay isLoading={isLoading}>
          {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'teachers'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Teachers ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'students'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Students ({students.length})
          </button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {activeTab === 'teachers' ? (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Teachers Management</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5" />
                      <span>Students Management</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  Manage {activeTab === 'teachers' ? 'teacher' : 'student'} accounts and permissions
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
                </Button>
                <Button 
                  onClick={() => setShowBulkImport(true)}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import {activeTab === 'teachers' ? 'Teachers' : 'Students'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Info Card */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs">i</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Adding Users</p>
                  <p className="text-xs text-blue-700 mt-1">
                    When you add a {activeTab === 'teachers' ? 'teacher' : 'student'}, they will receive login credentials. 
                    Default password format: {activeTab === 'teachers' ? 'EmployeeID@123' : 'RollNumber@123'}
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Bulk Import */}
            {showBulkImport && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Bulk Import {activeTab === 'teachers' ? 'Teachers' : 'Students'}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBulkImport(false)}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Close
                  </Button>
                </div>
                <ExcelImport 
                  type={activeTab} 
                  onImportComplete={handleBulkImport}
                />
              </div>
            )}

            {/* Add User Form Modal */}
            <Modal
              isOpen={showAddForm}
              onClose={() => setShowAddForm(false)}
              title={`Add New ${activeTab === 'teachers' ? 'Teacher' : 'Student'}`}
              size="lg"
            >
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {activeTab === 'teachers' ? 'Employee ID' : 'Roll Number'}
                    </label>
                    <Input
                      type="text"
                      placeholder={activeTab === 'teachers' ? 'Enter employee ID' : 'Enter roll number'}
                      value={newUser.employeeId}
                      onChange={(e) => setNewUser({...newUser, employeeId: e.target.value})}
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
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
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
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept.value} value={dept.value}>{dept.label}</option>
                      ))}
                    </select>
                  </div>

                  {activeTab === 'teachers' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter designation"
                        value={newUser.designation}
                        onChange={(e) => setNewUser({...newUser, designation: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  {/* Student-specific fields */}
                  {activeTab === 'students' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Semester
                        </label>
                        <select
                          value={newUser.semester}
                          onChange={(e) => setNewUser({...newUser, semester: e.target.value})}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Semester</option>
                          {semesterOptions.map((sem) => (
                            <option key={sem.value} value={sem.value}>{sem.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Batch
                        </label>
                        <select
                          value={newUser.batch}
                          onChange={(e) => setNewUser({...newUser, batch: e.target.value})}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Batch</option>
                          {batchOptions.map((batch) => (
                            <option key={batch.value} value={batch.value}>{batch.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter section (A, B, C, etc.)"
                          value={newUser.section}
                          onChange={(e) => setNewUser({...newUser, section: e.target.value.toUpperCase()})}
                          maxLength={1}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Father's Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter father's name"
                          value={newUser.fatherName}
                          onChange={(e) => setNewUser({...newUser, fatherName: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Group
                        </label>
                        <select
                          value={newUser.bloodGroup}
                          onChange={(e) => setNewUser({...newUser, bloodGroup: e.target.value})}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroupOptions.map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newUser.category}
                          onChange={(e) => setNewUser({...newUser, category: e.target.value})}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          {categoryOptions.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>

                <div className="md:col-span-2 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
                  </Button>
                </div>
              </form>
            </Modal>

            {/* Users List */}
            <div className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading {activeTab}...</p>
                </div>
              ) : activeTab === 'teachers' ? (
                filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{teacher.name}</p>
                            {teacher.isHOD && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-300">
                                HOD
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{teacher.employeeId} • {teacher.designation}</p>
                          <p className="text-sm text-gray-500">{teacher.department}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={teacher.isHOD ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleHOD(teacher.id, !teacher.isHOD)}
                        className={teacher.isHOD ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        <Award className="w-4 h-4 mr-1" />
                        {teacher.isHOD ? 'Remove HOD' : 'Make HOD'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(teacher.id, teacher.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.rollNo} • {student.semester} Semester • Section {student.section}</p>
                          <p className="text-sm text-gray-500">
                            <span className="inline-flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {student.departmentCode} - {student.department}
                            </span>
                            <span className="ml-2">• {student.batch}</span>
                          </p>
                          {student.category && (
                            <p className="text-xs text-gray-400">
                              <Award className="w-3 h-3 inline mr-1" />
                              {student.category} • {student.bloodGroup}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(student.id, student.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
          </LoadingOverlay>
        </div>
      </DashboardLayout>
    </>
  )
}