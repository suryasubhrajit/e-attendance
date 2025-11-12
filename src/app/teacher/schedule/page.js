'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  LogOut, 
  Users, 
  Calendar, 
  Clock,
  MapPin
} from 'lucide-react'

export default function TeacherSchedule() {
  const teacherInfo = {
    name: "Dr. Priya Sharma",
    employeeId: "EMP001",
    department: "Computer Science Engineering"
  }

  const schedule = [
    {
      day: 'Monday',
      classes: [
        { time: '09:00 - 10:00', subject: 'Software Engineering', class: 'CS501-A', room: 'Room 101' },
        { time: '11:00 - 12:00', subject: 'Database Management', class: 'CS502-B', room: 'Room 203' },
        { time: '14:00 - 15:00', subject: 'Data Structures', class: 'CS301-A', room: 'Lab 1' }
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '10:00 - 11:00', subject: 'Software Engineering', class: 'CS501-A', room: 'Room 101' },
        { time: '15:00 - 16:00', subject: 'Database Management', class: 'CS502-B', room: 'Lab 2' }
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '09:00 - 10:00', subject: 'Data Structures', class: 'CS301-A', room: 'Room 105' },
        { time: '11:00 - 12:00', subject: 'Software Engineering', class: 'CS501-A', room: 'Room 101' },
        { time: '14:00 - 15:00', subject: 'Database Management', class: 'CS502-B', room: 'Room 203' }
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { time: '10:00 - 11:00', subject: 'Data Structures', class: 'CS301-A', room: 'Lab 1' },
        { time: '15:00 - 16:00', subject: 'Software Engineering', class: 'CS501-A', room: 'Room 101' }
      ]
    },
    {
      day: 'Friday',
      classes: [
        { time: '09:00 - 10:00', subject: 'Database Management', class: 'CS502-B', room: 'Room 203' },
        { time: '11:00 - 12:00', subject: 'Data Structures', class: 'CS301-A', room: 'Room 105' }
      ]
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
                <p className="text-sm text-gray-500">My Schedule</p>
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Users className="w-5 h-5" />
                <span>Manage Students</span>
              </a>
              <a
                href="/teacher/schedule"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Schedule</h1>
            <p className="text-gray-600">Your weekly class schedule and timetable</p>
          </div>

          <div className="space-y-6">
            {schedule.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle>{day.day}</CardTitle>
                  <CardDescription>{day.classes.length} classes scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.classes.map((classItem, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{classItem.time}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{classItem.subject}</p>
                            <p className="text-sm text-gray-500">{classItem.class}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{classItem.room}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}