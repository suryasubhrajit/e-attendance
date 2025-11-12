'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, Clock, LogOut, Plus, Search, CheckCircle, XCircle } from 'lucide-react'

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState('CS501-A')
  const [attendanceMode, setAttendanceMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock teacher data
  const teacherInfo = {
    name: "Dr. Priya Sharma",
    employeeId: "EMP001",
    department: "Computer Science Engineering",
    designation: "Associate Professor"
  }

  const classes = [
    { id: 'CS501-A', name: 'Software Engineering', semester: '5th', batch: '2021-25', students: 45 },
    { id: 'CS502-B', name: 'Database Management', semester: '5th', batch: '2021-25', students: 42 },
    { id: 'CS301-A', name: 'Data Structures', semester: '3rd', batch: '2022-26', students: 48 }
  ]

  const students = [
    { rollNo: '2021001', name: 'Rahul Kumar', present: true },
    { rollNo: '2021002', name: 'Priya Singh', present: true },
    { rollNo: '2021003', name: 'Amit Patel', present: false },
    { rollNo: '2021004', name: 'Sneha Reddy', present: true },
    { rollNo: '2021005', name: 'Vikash Gupta', present: false },
    { rollNo: '2021006', name: 'Anita Sharma', present: true },
    { rollNo: '2021007', name: 'Ravi Kumar', present: true },
    { rollNo: '2021008', name: 'Pooja Mishra', present: false }
  ]

  const recentSessions = [
    { date: '2024-11-06', class: 'CS501-A', topic: 'SDLC Models', present: 38, total: 45 },
    { date: '2024-11-05', class: 'CS502-B', topic: 'Normalization', present: 35, total: 42 },
    { date: '2024-11-04', class: 'CS301-A', topic: 'Binary Trees', present: 42, total: 48 },
    { date: '2024-11-03', class: 'CS501-A', topic: 'Requirements Analysis', present: 40, total: 45 }
  ]

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  )

  const toggleAttendance = (rollNo) => {
    // Toggle student attendance logic here
    console.log('Toggle attendance for:', rollNo)
  }

  const saveAttendance = () => {
    // Save attendance logic here
    console.log('Saving attendance for class:', selectedClass)
    setAttendanceMode(false)
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
                <p className="text-sm text-gray-500">Teacher Portal</p>
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
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
          {/* Teacher Info */}
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Quick Action</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mark Attendance</h3>
                  <Button 
                    onClick={() => window.location.href = '/teacher/attendance'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Start Now
                  </Button>
                </div>
                <Clock className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Students</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Students</h3>
                  <Button 
                    onClick={() => window.location.href = '/teacher/students'}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <Users className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Schedule</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">My Classes</h3>
                  <Button 
                    onClick={() => window.location.href = '/teacher/schedule'}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-100"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Schedule
                  </Button>
                </div>
                <Calendar className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{teacherInfo.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{teacherInfo.designation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Class Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Select a class to manage attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <p className="text-sm text-gray-500">{cls.id}</p>
                      <p className="text-sm text-gray-500">{cls.semester} • {cls.batch}</p>
                      <p className="text-sm font-medium text-blue-600">{cls.students} students</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Attendance Management</CardTitle>
                    <CardDescription>
                      {classes.find(c => c.id === selectedClass)?.name} - {selectedClass}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setAttendanceMode(!attendanceMode)}
                    variant={attendanceMode ? "destructive" : "default"}
                  >
                    {attendanceMode ? 'Cancel' : 'Take Attendance'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {attendanceMode ? (
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Student List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredStudents.map((student) => (
                        <div
                          key={student.rollNo}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.rollNo}</p>
                          </div>
                          <Button
                            onClick={() => toggleAttendance(student.rollNo)}
                            variant={student.present ? "default" : "outline"}
                            size="sm"
                          >
                            {student.present ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Present
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                Absent
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setAttendanceMode(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveAttendance}>
                        Save Attendance
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Click "Take Attendance" to start marking attendance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium text-gray-900">{session.class}</p>
                      <p className="text-sm text-gray-600">{session.topic}</p>
                      <p className="text-xs text-gray-500">{session.date}</p>
                      <p className="text-sm font-medium text-blue-600">
                        {session.present}/{session.total} present
                      </p>
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