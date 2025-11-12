'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, BookOpen, User, LogOut, CheckCircle, XCircle, AlertCircle, Building, Award, Phone, Mail } from 'lucide-react'
import { getDepartmentById } from '@/data/departments'

export default function StudentDashboard() {
  const [selectedSemester, setSelectedSemester] = useState('5')
  
  // Mock student data
  const studentInfo = {
    name: "Rahul Kumar",
    rollNumber: "2021CSE001",
    semester: "5th Semester",
    branch: "Computer Science Engineering",
    departmentCode: "CSE",
    departmentId: "cse",
    batch: "2021-2025",
    year: "3rd Year",
    section: "A",
    fatherName: "Suresh Kumar",
    motherName: "Sunita Kumar",
    email: "rahul.kumar@kmbb.in",
    phone: "+91 8765432109",
    bloodGroup: "B+",
    category: "General",
    address: "123 Main Street, Khordha, Odisha"
  }
  
  const departmentInfo = getDepartmentById(studentInfo.departmentId)

  const attendanceData = {
    overall: 78.5,
    subjects: [
      { code: 'CS501', name: 'Software Engineering', attended: 28, total: 35, percentage: 80 },
      { code: 'CS502', name: 'Database Management', attended: 25, total: 32, percentage: 78.1 },
      { code: 'CS503', name: 'Computer Networks', attended: 22, total: 30, percentage: 73.3 },
      { code: 'CS504', name: 'Operating Systems', attended: 30, total: 36, percentage: 83.3 },
      { code: 'CS505', name: 'Web Technology', attended: 26, total: 33, percentage: 78.8 }
    ]
  }

  const recentAttendance = [
    { date: '2024-11-06', subject: 'Software Engineering', status: 'present', time: '09:00 AM' },
    { date: '2024-11-05', subject: 'Database Management', status: 'present', time: '11:00 AM' },
    { date: '2024-11-04', subject: 'Computer Networks', status: 'absent', time: '02:00 PM' },
    { date: '2024-11-03', subject: 'Operating Systems', status: 'present', time: '10:00 AM' },
    { date: '2024-11-02', subject: 'Web Technology', status: 'late', time: '03:00 PM' }
  ]

  const getAttendanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50'
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />
      case 'late': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default: return null
    }
  }

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
                <p className="text-sm text-gray-500">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{studentInfo.name}</p>
                <p className="text-xs text-gray-500">{studentInfo.rollNumber}</p>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Panel</h2>
            <nav className="space-y-2">
              <a
                href="/student/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
              >
                <BookOpen className="w-5 h-5" />
                <span>My Attendance</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Calendar className="w-5 h-5" />
                <span>Academic Calendar</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <User className="w-5 h-5" />
                <span>My Profile</span>
              </a>
              <a
                href="/student/attendance-history"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Clock className="w-5 h-5" />
                <span>Attendance History</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Student Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Student Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Academic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Academic Details
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="font-medium text-gray-900 dark:text-white">{studentInfo.departmentCode} - {studentInfo.branch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Semester & Section</p>
                    <p className="font-medium text-gray-900 dark:text-white">{studentInfo.semester} • Section {studentInfo.section}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Batch</p>
                    <p className="font-medium text-gray-900 dark:text-white">{studentInfo.batch}</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Details
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Father's Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{studentInfo.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Blood Group</p>
                    <p className="font-medium text-gray-900 dark:text-white">{studentInfo.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {studentInfo.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Details
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {studentInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{studentInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Information */}
            {departmentInfo && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Department Information</h4>
                <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">{departmentInfo.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Duration:</span>
                    <span className="text-blue-800 dark:text-blue-400 ml-2">{departmentInfo.duration}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Total Semesters:</span>
                    <span className="text-blue-800 dark:text-blue-400 ml-2">{departmentInfo.totalSemesters}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Your attendance for {studentInfo.semester}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Overall Attendance */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Overall Attendance</p>
                      <p className="text-2xl font-bold text-blue-600">{attendanceData.overall}%</p>
                    </div>
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray={`${attendanceData.overall}, 100`}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Subject-wise Attendance */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Subject-wise Attendance</h4>
                  {attendanceData.subjects.map((subject) => (
                    <div key={subject.code} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        <p className="text-sm text-gray-500">{subject.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{subject.attended}/{subject.total} classes</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(subject.percentage)}`}>
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Attendance */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Attendance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAttendance.map((record, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                      {getStatusIcon(record.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{record.subject}</p>
                        <p className="text-xs text-gray-500">{record.date} • {record.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
        </div>
      </div>
    </div>
  )
}