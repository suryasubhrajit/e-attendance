'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  LogOut, 
  BarChart3, 
  Users, 
  Calendar, 
  Shield,
  Download,
  FileText,
  TrendingUp,
  Search,
  Eye
} from 'lucide-react'
import { AttendanceHistory } from '@/components/AttendanceHistory'
import { Modal } from '@/components/ui/modal'

export default function AdminReports() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  const adminInfo = {
    name: "Dr. Rajesh Kumar",
    employeeId: "PRIN001",
    designation: "Principal"
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      if (data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  const filteredStudents = students.filter(student =>
    student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const viewStudentHistory = (student) => {
    setSelectedStudent(student)
    setShowHistory(true)
  }

  const reports = [
    {
      title: "Monthly Attendance Report",
      description: "Comprehensive attendance data for all departments",
      type: "monthly",
      lastGenerated: "2024-11-01"
    },
    {
      title: "Department-wise Analysis",
      description: "Performance metrics by department",
      type: "department",
      lastGenerated: "2024-10-28"
    },
    {
      title: "Low Attendance Alert Report",
      description: "Students with attendance below 75%",
      type: "alerts",
      lastGenerated: "2024-11-06"
    },
    {
      title: "Teacher Performance Report",
      description: "Class-wise teaching effectiveness metrics",
      type: "teacher",
      lastGenerated: "2024-10-25"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">KMBB CET</h1>
                <p className="text-sm text-gray-500">Reports & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminInfo.name}</p>
                <p className="text-xs text-gray-500">{adminInfo.designation}</p>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h2>
            <nav className="space-y-2">
              <a
                href="/admin/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a
                href="/admin/users"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Users className="w-5 h-5" />
                <span>Manage Users</span>
              </a>
              <a
                href="/admin/calendar"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Calendar className="w-5 h-5" />
                <span>Academic Calendar</span>
              </a>
              <a
                href="/admin/reports"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
              >
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </a>
              <a
                href="/admin/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Shield className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and download various reports for institutional analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>{report.title}</span>
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Last Generated</p>
                      <p className="font-medium">{report.lastGenerated}</p>
                    </div>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Student Attendance History Viewer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Student Attendance History</span>
              </CardTitle>
              <CardDescription>View lifetime attendance records for any student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students by name, roll number, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchTerm && (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredStudents.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No students found</p>
                  ) : (
                    filteredStudents.slice(0, 10).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{student.user.name}</p>
                          <p className="text-sm text-gray-500">
                            {student.rollNo} • {student.departmentCode} • Sem {student.semester}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => viewStudentHistory(student)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View History
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
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
                studentName={`${selectedStudent.user.name} (${selectedStudent.rollNo})`}
              />
            )}
          </Modal>
        </div>
      </div>
    </div>
  )
}