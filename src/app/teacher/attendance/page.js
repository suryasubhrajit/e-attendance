'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Clock,
  Save,
  BarChart3,
  User,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertCircle
} from 'lucide-react'
import { useNotification } from '@/components/Notification'

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState(null)
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const [attendanceData, setAttendanceData] = useState({})
  const [attendanceStats, setAttendanceStats] = useState({})
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0])
  const [sessionTopic, setSessionTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showCarousel, setShowCarousel] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showBulkAttendance, setShowBulkAttendance] = useState(false)
  const { addNotification, NotificationContainer } = useNotification()

  const teacherInfo = {
    name: "Dr. Priya Sharma",
    employeeId: "EMP001",
    department: "Computer Science Engineering"
  }

  useEffect(() => {
    loadClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass])

  useEffect(() => {
    if (students.length > 0) {
      loadAttendanceStats()
    }
  }, [students])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      if (data.classes) {
        setClasses(data.classes)
        if (data.classes.length > 0 && !selectedClass) {
          setSelectedClass(data.classes[0].id)
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
      const response = await fetch(`/api/students?classId=${selectedClass}`)
      const data = await response.json()

      if (data.students) {
        setStudents(data.students)
        // Initialize attendance data
        const initialData = {}
        data.students.forEach(student => {
          initialData[student.id] = 'present' // Default to present
        })
        setAttendanceData(initialData)
      }
    } catch (error) {
      console.error('Error loading students:', error)
      addNotification('error', 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const loadAttendanceStats = async () => {
    try {
      const stats = {}
      for (const student of students) {
        const response = await fetch(`/api/attendance/stats?studentId=${student.id}&classId=${selectedClass}`)
        const data = await response.json()
        stats[student.id] = data
      }
      setAttendanceStats(stats)
    } catch (error) {
      console.error('Error loading attendance stats:', error)
    }
  }

  const startAttendance = () => {
    if (!sessionTopic.trim()) {
      addNotification('error', 'Please enter the session topic before starting')
      return
    }
    setShowCarousel(true)
    setCurrentStudentIndex(0)
  }

  const markAttendance = (status) => {
    const currentStudent = students[currentStudentIndex]
    const updatedData = {
      ...attendanceData,
      [currentStudent.id]: status
    }
    setAttendanceData(updatedData)

    // Auto-advance to next student after marking
    if (currentStudentIndex < students.length - 1) {
      setTimeout(() => {
        setCurrentStudentIndex(prev => prev + 1)
      }, 400)
    } else {
      // Last student - show summary after a delay
      setTimeout(() => {
        setShowCarousel(false)
        setShowSummary(true)
      }, 400)
    }
  }

  const goToPrevious = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(prev => prev - 1)
    }
  }

  const goToNext = () => {
    const currentStudent = students[currentStudentIndex]

    // Check if current student's attendance is marked
    if (!attendanceData[currentStudent.id]) {
      addNotification('error', 'Please mark attendance before moving to next student')
      return
    }

    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(prev => prev + 1)
    } else {
      // Last student - show completion message
      addNotification('success', 'All students marked! Click Save Attendance to submit.')
    }
  }

  const saveAttendance = async () => {
    try {
      setSaving(true)

      const attendanceRecords = students.map(student => ({
        studentId: student.id,
        status: attendanceData[student.id] || 'absent'
      }))

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: selectedClass,
          date: sessionDate,
          topic: sessionTopic,
          attendanceData: attendanceRecords
        })
      })

      const data = await response.json()

      if (response.ok) {
        addNotification('success', `Attendance saved successfully for ${data.count} students!`)
        // Reload stats
        await loadAttendanceStats()
        // Reset for next session
        setShowSummary(false)
        setShowCarousel(false)
        setSessionTopic('')
        setCurrentStudentIndex(0)
        // Reset attendance data
        const initialData = {}
        students.forEach(student => {
          initialData[student.id] = 'present'
        })
        setAttendanceData(initialData)
      } else {
        addNotification('error', data.error || 'Failed to save attendance')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      addNotification('error', 'Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) return { label: 'Excellent', color: 'text-green-600', icon: TrendingUp, bg: 'bg-green-50' }
    if (percentage >= 75) return { label: 'Good', color: 'text-blue-600', icon: Minus, bg: 'bg-blue-50' }
    if (percentage >= 65) return { label: 'Average', color: 'text-yellow-600', icon: Minus, bg: 'bg-yellow-50' }
    return { label: 'Poor', color: 'text-red-600', icon: TrendingDown, bg: 'bg-red-50' }
  }

  const currentStudent = students[currentStudentIndex]
  const selectedClassInfo = classes.find(cls => cls.id === selectedClass)
  const presentCount = Object.values(attendanceData).filter(status => status === 'present').length
  const absentCount = students.length - presentCount

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
                  <p className="text-sm text-gray-500">Mark Attendance</p>
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
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
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
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Class Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Class</CardTitle>
                <CardDescription>Choose a class to mark attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls.id)
                        setCurrentStudentIndex(0)
                      }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedClass === cls.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <h4 className="font-medium text-gray-900">{cls.name}</h4>
                      <p className="text-sm text-gray-500">{cls.code}</p>
                      <p className="text-sm text-gray-500">{cls.semester} • {cls.batch}</p>
                      <p className="text-sm font-medium text-blue-600">{cls._count?.students || 0} students</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Details */}
            {selectedClass && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topic/Subject
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter today's topic"
                        value={sessionTopic}
                        onChange={(e) => setSessionTopic(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attendance Summary */}
            {selectedClass && students.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{students.length}</p>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                      <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                      <p className="text-sm text-gray-600">Absent</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={startAttendance}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
                    >
                      <Clock className="w-6 h-6 mr-3" />
                      Start Marking Attendance
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setShowBulkAttendance(true)}
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
                    >
                      <Users className="w-6 h-6 mr-3" />
                      Bulk Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clean Attendance Popup */}
            {showCarousel && currentStudent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowCarousel(false)}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Main Content - Two Column Layout */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Left Side - Student Details */}
                    <div className="w-2/5 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col justify-center">
                      {/* Avatar */}
                      <div className="text-center mb-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <span className="text-5xl font-bold text-white">
                            {currentStudent.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Student Name */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {currentStudent.user.name}
                        </h2>

                        {/* Roll Number */}
                        <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm">
                          <p className="text-lg font-mono font-semibold text-gray-700">
                            {currentStudent.rollNo}
                          </p>
                        </div>
                      </div>

                      {/* Student Details */}
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1">Department</p>
                          <p className="text-lg font-bold text-gray-900">{currentStudent.departmentCode}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                            <p className="text-xs text-gray-500 mb-1">Semester</p>
                            <p className="text-base font-bold text-gray-900">{currentStudent.semester}</p>
                          </div>
                          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                            <p className="text-xs text-gray-500 mb-1">Section</p>
                            <p className="text-base font-bold text-gray-900">{currentStudent.section}</p>
                          </div>
                          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                            <p className="text-xs text-gray-500 mb-1">Batch</p>
                            <p className="text-base font-bold text-gray-900">{currentStudent.batch.split('-')[0]}</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Student {currentStudentIndex + 1} of {students.length}
                        </p>
                        <div className="w-full bg-white/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${((currentStudentIndex + 1) / students.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Attendance Stats & Actions */}
                    <div className="flex-1 p-8 flex flex-col">
                      {/* Attendance Statistics */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Record</h3>

                        {attendanceStats[currentStudent.id] && (() => {
                          const stats = attendanceStats[currentStudent.id]
                          const status = getAttendanceStatus(stats.percentage)
                          const StatusIcon = status.icon

                          return (
                            <div className="space-y-3">
                              {/* Compact Percentage Card */}
                              <div className={`${status.bg} border-2 rounded-xl p-4 text-center`}>
                                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border ${status.color} mb-2`}>
                                  <StatusIcon className="w-4 h-4" />
                                  <span className="text-sm font-bold">{status.label}</span>
                                </div>

                                <p className={`text-5xl font-bold ${status.color} mb-1`}>
                                  {stats.percentage}%
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {stats.present} / {stats.total} classes
                                </p>
                              </div>

                              {/* Warning - Compact */}
                              {stats.percentage < 75 && (
                                <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                                  <div className="flex items-start space-x-2">
                                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-800">
                                      <strong>Below 75%:</strong> Needs {Math.ceil((0.75 * (stats.total + 1)) - stats.present)} more classes
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>

                      {/* Mark Attendance Buttons */}
                      <div className="mt-auto">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Mark Today's Attendance</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <button
                            onClick={() => markAttendance('present')}
                            className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${attendanceData[currentStudent.id] === 'present'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                              : 'bg-white text-gray-700 hover:bg-green-50 hover:border-green-400 border-2 border-gray-300'
                              }`}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <CheckCircle className={`w-8 h-8 ${attendanceData[currentStudent.id] === 'present' ? 'text-white' : 'text-green-600'
                                }`} />
                              <span className="text-lg font-bold">Present</span>
                              {attendanceData[currentStudent.id] === 'present' && (
                                <span className="text-xs opacity-90">✓ Marked</span>
                              )}
                            </div>
                          </button>

                          <button
                            onClick={() => markAttendance('absent')}
                            className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${attendanceData[currentStudent.id] === 'absent'
                              ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg scale-105'
                              : 'bg-white text-gray-700 hover:bg-red-50 hover:border-red-400 border-2 border-gray-300'
                              }`}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <XCircle className={`w-8 h-8 ${attendanceData[currentStudent.id] === 'absent' ? 'text-white' : 'text-red-600'
                                }`} />
                              <span className="text-lg font-bold">Absent</span>
                              {attendanceData[currentStudent.id] === 'absent' && (
                                <span className="text-xs opacity-90">✓ Marked</span>
                              )}
                            </div>
                          </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            onClick={goToPrevious}
                            disabled={currentStudentIndex === 0}
                            className="px-6 py-3"
                          >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Previous
                          </Button>

                          <Button
                            variant="outline"
                            onClick={goToNext}
                            disabled={!attendanceData[currentStudent.id] || currentStudentIndex === students.length - 1}
                            className="px-6 py-3"
                            title={!attendanceData[currentStudent.id] ? 'Mark attendance before proceeding' : ''}
                          >
                            Next
                            <ChevronRight className="w-5 h-5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Summary Popup */}
            {showSummary && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
                    <h2 className="text-2xl font-bold mb-2">Attendance Summary</h2>
                    <p className="text-blue-100">{selectedClassInfo?.name} • {sessionDate}</p>
                  </div>

                  {/* Summary Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-green-600">
                          {Object.values(attendanceData).filter(s => s === 'present').length}
                        </p>
                        <p className="text-sm text-gray-600">Present</p>
                      </div>
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-red-600">
                          {Object.values(attendanceData).filter(s => s === 'absent').length}
                        </p>
                        <p className="text-sm text-gray-600">Absent</p>
                      </div>
                    </div>

                    {/* Student Lists */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Present Students */}
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Present Students
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {students.filter(s => attendanceData[s.id] === 'present').map((student, idx) => (
                            <div key={student.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="font-semibold text-gray-900">{idx + 1}. {student.user.name}</p>
                              <p className="text-sm text-gray-600">{student.rollNo}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Absent Students */}
                      <div>
                        <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                          <XCircle className="w-5 h-5 mr-2" />
                          Absent Students
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {students.filter(s => attendanceData[s.id] === 'absent').map((student, idx) => (
                            <div key={student.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="font-semibold text-gray-900">{idx + 1}. {student.user.name}</p>
                              <p className="text-sm text-gray-600">{student.rollNo}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowSummary(false)
                          setShowCarousel(true)
                          setCurrentStudentIndex(0)
                        }}
                        className="px-6"
                      >
                        Go Back & Edit
                      </Button>
                      <Button
                        onClick={saveAttendance}
                        disabled={saving}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {saving ? 'Saving...' : 'Save Attendance'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Students Message */}
            {selectedClass && students.length === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No students enrolled in this class</p>
                  <p className="text-sm text-gray-500">Please add students to this class first</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Attendance Modal */}
      {showBulkAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Bulk Attendance</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Mark attendance for all students at once
                  </p>
                </div>
                <button
                  onClick={() => setShowBulkAttendance(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium text-gray-900">{sessionDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Topic:</span>
                  <span className="ml-2 font-medium text-gray-900">{sessionTopic || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-3 bg-gray-50 border-b flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  const newData = {}
                  students.forEach(s => newData[s.id] = 'present')
                  setAttendanceData(newData)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark All Present
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const newData = {}
                  students.forEach(s => newData[s.id] = 'absent')
                  setAttendanceData(newData)
                }}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Mark All Absent
              </Button>
            </div>

            {/* Students List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      attendanceData[student.id] === 'present'
                        ? 'bg-green-50 border-green-300'
                        : attendanceData[student.id] === 'absent'
                        ? 'bg-red-50 border-red-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.user.name}</p>
                        <p className="text-sm text-gray-600">{student.rollNo}</p>
                      </div>
                    </div>

                    {/* Attendance Toggle Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAttendanceData({
                          ...attendanceData,
                          [student.id]: 'present'
                        })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          attendanceData[student.id] === 'present'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5 inline mr-1" />
                        Present
                      </button>
                      <button
                        onClick={() => setAttendanceData({
                          ...attendanceData,
                          [student.id]: 'absent'
                        })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          attendanceData[student.id] === 'absent'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-red-50'
                        }`}
                      >
                        <XCircle className="w-5 h-5 inline mr-1" />
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-gray-700">Present: <strong>{presentCount}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-700">Absent: <strong>{absentCount}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">Total: <strong>{students.length}</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkAttendance(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await saveAttendance()
                    setShowBulkAttendance(false)
                  }}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Save Attendance'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
