'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  LogOut, 
  BarChart3, 
  Users, 
  Calendar, 
  Shield,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const adminInfo = {
    name: "Dr. Rajesh Kumar",
    employeeId: "PRIN001",
    designation: "Principal"
  }

  const events = [
    { date: '2024-11-15', title: 'Mid-term Examinations Begin', type: 'exam' },
    { date: '2024-11-20', title: 'Faculty Meeting', type: 'meeting' },
    { date: '2024-11-25', title: 'Cultural Festival', type: 'event' },
    { date: '2024-12-01', title: 'Semester End Examinations', type: 'exam' },
    { date: '2024-12-15', title: 'Winter Break Begins', type: 'holiday' }
  ]

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
                <p className="text-sm text-gray-500">Academic Calendar</p>
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
              >
                <Calendar className="w-5 h-5" />
                <span>Academic Calendar</span>
              </a>
              <a
                href="/admin/reports"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <BookOpen className="w-5 h-5" />
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
              <p className="text-gray-600">Manage academic events and important dates</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-2 text-center font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i + 1}
                        className="p-2 text-center border rounded hover:bg-gray-50 cursor-pointer min-h-[60px]"
                      >
                        <span className="text-sm font-medium">{i + 1}</span>
                        {events.some(event => new Date(event.date).getDate() === i + 1) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Important academic dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          event.type === 'exam' ? 'bg-red-100 text-red-800' :
                          event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'event' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.type}
                        </span>
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