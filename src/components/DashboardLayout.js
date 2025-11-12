'use client'

import { 
  BarChart3, 
  Users, 
  Calendar, 
  BookOpen, 
  Shield, 
  Clock, 
  User,
  LogOut,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

function DashboardLayout({ 
  children, 
  userInfo, 
  currentPage = 'dashboard', 
  userType = 'admin',
  title = 'KMBB CET',
  subtitle = 'Dashboard'
}) {
  const getNavItems = () => {
    switch (userType) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/admin/dashboard' },
          { id: 'users', label: 'Manage Users', icon: Users, href: '/admin/users' },
          { id: 'import', label: 'Bulk Import', icon: Upload, href: '/admin/import' },
          { id: 'calendar', label: 'Academic Calendar', icon: Calendar, href: '/admin/calendar' },
          { id: 'reports', label: 'Reports', icon: BookOpen, href: '/admin/reports' },
          { id: 'settings', label: 'Settings', icon: Shield, href: '/admin/settings' }
        ]
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BookOpen, href: '/teacher/dashboard' },
          { id: 'students', label: 'Manage Students', icon: Users, href: '/teacher/students' },
          { id: 'import', label: 'Import Students', icon: Upload, href: '/teacher/import' },
          { id: 'schedule', label: 'My Schedule', icon: Calendar, href: '/teacher/schedule' },
          { id: 'reports', label: 'Attendance Reports', icon: Clock, href: '/teacher/reports' }
        ]
      case 'student':
        return [
          { id: 'attendance', label: 'My Attendance', icon: BookOpen, href: '/student/dashboard' },
          { id: 'calendar', label: 'Academic Calendar', icon: Calendar, href: '#' },
          { id: 'profile', label: 'My Profile', icon: User, href: '#' },
          { id: 'history', label: 'Attendance History', icon: Clock, href: '/student/attendance-history' }
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()
  const panelTitle = userType === 'admin' ? 'Admin Panel' : 
                    userType === 'teacher' ? 'Teacher Panel' : 'Student Panel'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-all duration-500">
      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {userInfo && (
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userInfo.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {userInfo.designation || userInfo.employeeId || userInfo.rollNumber}
                  </p>
                </div>
              )}
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
        <div className="w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm border-r border-slate-200/50 dark:border-slate-700/50 min-h-screen transition-all duration-500">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{panelTitle}</h2>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-sm'
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

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
export
 default DashboardLayout
