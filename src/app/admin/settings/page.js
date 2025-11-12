'use client'

import { useState } from 'react'
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
  Save,
  Settings,
  Bell,
  Lock,
  Database
} from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    collegeName: 'KMBB College of Engineering and Technology',
    collegeCode: 'KMBBCET',
    academicYear: '2024-2025',
    attendanceThreshold: 75,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily'
  })

  const adminInfo = {
    name: "Dr. Rajesh Kumar",
    employeeId: "PRIN001",
    designation: "Principal"
  }

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
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
                <p className="text-sm text-gray-500">System Settings</p>
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <BookOpen className="w-5 h-5" />
                <span>Reports</span>
              </a>
              <a
                href="/admin/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>General Settings</span>
                </CardTitle>
                <CardDescription>Basic institutional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      College Name
                    </label>
                    <Input
                      value={settings.collegeName}
                      onChange={(e) => setSettings({...settings, collegeName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      College Code
                    </label>
                    <Input
                      value={settings.collegeCode}
                      onChange={(e) => setSettings({...settings, collegeCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year
                    </label>
                    <Input
                      value={settings.academicYear}
                      onChange={(e) => setSettings({...settings, academicYear: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendance Threshold (%)
                    </label>
                    <Input
                      type="number"
                      value={settings.attendanceThreshold}
                      onChange={(e) => setSettings({...settings, attendanceThreshold: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Send attendance alerts via email</p>
                  </div>
                  <Button
                    variant={settings.emailNotifications ? "default" : "outline"}
                    onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                  >
                    {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Send attendance alerts via SMS</p>
                  </div>
                  <Button
                    variant={settings.smsNotifications ? "default" : "outline"}
                    onClick={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})}
                  >
                    {settings.smsNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>System Settings</span>
                </CardTitle>
                <CardDescription>Database and backup configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Backup</p>
                    <p className="text-sm text-gray-500">Automatically backup system data</p>
                  </div>
                  <Button
                    variant={settings.autoBackup ? "default" : "outline"}
                    onClick={() => setSettings({...settings, autoBackup: !settings.autoBackup})}
                  >
                    {settings.autoBackup ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} className="px-8">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}