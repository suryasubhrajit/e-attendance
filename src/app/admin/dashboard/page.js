'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function AdminDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedSemester, setSelectedSemester] = useState('all')

  // Mock admin data
  const adminInfo = {
    name: "Dr. Rajesh Kumar",
    employeeId: "PRIN001",
    designation: "Principal",
    college: "KMBB College of Engineering and Technology"
  }

  const overallStats = {
    totalStudents: 1250,
    totalTeachers: 85,
    totalClasses: 156,
    avgAttendance: 82.3
  }

  const departmentStats = [
    { name: 'Computer Science', students: 320, attendance: 85.2, trend: 'up' },
    { name: 'Mechanical', students: 280, attendance: 79.8, trend: 'down' },
    { name: 'Electrical', students: 250, attendance: 83.1, trend: 'up' },
    { name: 'Civil', students: 220, attendance: 78.5, trend: 'down' },
    { name: 'Electronics', students: 180, attendance: 86.7, trend: 'up' }
  ]

  const semesterStats = [
    { semester: '1st', students: 245, attendance: 88.5 },
    { semester: '2nd', students: 238, attendance: 85.2 },
    { semester: '3rd', students: 232, attendance: 83.7 },
    { semester: '4th', students: 225, attendance: 81.9 },
    { semester: '5th', students: 218, attendance: 79.8 },
    { semester: '6th', students: 210, attendance: 78.2 },
    { semester: '7th', students: 205, attendance: 76.5 },
    { semester: '8th', students: 198, attendance: 82.1 }
  ]

  const lowAttendanceAlerts = [
    { student: 'Amit Kumar', rollNo: '2021045', department: 'CSE', attendance: 68.5 },
    { student: 'Priya Singh', rollNo: '2022032', department: 'ME', attendance: 71.2 },
    { student: 'Rahul Patel', rollNo: '2021078', department: 'EE', attendance: 69.8 },
    { student: 'Sneha Reddy', rollNo: '2023015', department: 'CE', attendance: 72.1 }
  ]

  const recentActivities = [
    { type: 'attendance', message: 'CS501-A attendance marked by Dr. Priya Sharma', time: '2 hours ago' },
    { type: 'alert', message: 'Low attendance alert for 15 students', time: '4 hours ago' },
    { type: 'report', message: 'Monthly attendance report generated', time: '1 day ago' },
    { type: 'system', message: 'New teacher account created for Dr. Amit Kumar', time: '2 days ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">KMBB CET</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{adminInfo.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{adminInfo.designation}</p>
              </div>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen transition-colors duration-300">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Panel</h2>
            <nav className="space-y-2">
              <a
                href="/admin/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium transition-colors duration-300"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a
                href="/admin/users"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors duration-300"
              >
                <Users className="w-5 h-5" />
                <span>Manage Users</span>
              </a>
              <a
                href="/admin/calendar"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors duration-300"
              >
                <Calendar className="w-5 h-5" />
                <span>Academic Calendar</span>
              </a>
              <a
                href="/admin/reports"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors duration-300"
              >
                <BookOpen className="w-5 h-5" />
                <span>Reports</span>
              </a>
              <a
                href="/admin/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors duration-300"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalTeachers}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalClasses}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.avgAttendance}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department-wise Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Attendance</CardTitle>
                <CardDescription>Attendance statistics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-sm text-gray-500">{dept.students} students</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{dept.attendance}%</p>
                        </div>
                        {dept.trend === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Semester-wise Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Semester-wise Attendance</CardTitle>
                <CardDescription>Attendance distribution across semesters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {semesterStats.map((sem) => (
                    <div key={sem.semester} className="p-4 border rounded-lg text-center">
                      <p className="font-medium text-gray-900">{sem.semester}</p>
                      <p className="text-sm text-gray-500">{sem.students} students</p>
                      <p className="text-lg font-bold text-blue-600">{sem.attendance}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Attendance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Low Attendance Alerts</span>
                </CardTitle>
                <CardDescription>Students with attendance below 75%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowAttendanceAlerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-gray-900">{alert.student}</p>
                      <p className="text-sm text-gray-600">{alert.rollNo} • {alert.department}</p>
                      <p className="text-sm font-medium text-red-600">{alert.attendance}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
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