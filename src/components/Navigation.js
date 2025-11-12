'use client'

import { 
  BarChart3, 
  Users, 
  Calendar, 
  BookOpen, 
  Shield, 
  Clock, 
  User,
  Search
} from 'lucide-react'

export function AdminNavigation({ currentPage = 'dashboard' }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/admin/dashboard' },
    { id: 'users', label: 'Manage Users', icon: Users, href: '/admin/users' },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar, href: '#' },
    { id: 'reports', label: 'Reports', icon: BookOpen, href: '#' },
    { id: 'settings', label: 'Settings', icon: Shield, href: '#' }
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function TeacherNavigation({ currentPage = 'dashboard' }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen, href: '/teacher/dashboard' },
    { id: 'students', label: 'Manage Students', icon: Users, href: '/teacher/students' },
    { id: 'schedule', label: 'My Schedule', icon: Calendar, href: '#' },
    { id: 'reports', label: 'Attendance Reports', icon: Clock, href: '#' }
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Teacher Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function StudentNavigation({ currentPage = 'attendance' }) {
  const navItems = [
    { id: 'attendance', label: 'My Attendance', icon: BookOpen, href: '/student/dashboard' },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar, href: '#' },
    { id: 'profile', label: 'My Profile', icon: User, href: '#' },
    { id: 'history', label: 'Attendance History', icon: Clock, href: '#' }
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}