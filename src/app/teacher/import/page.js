'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { RoleBasedImport } from '@/components/RoleBasedImport'
import { useNotification } from '@/components/Notification'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, GraduationCap, FileSpreadsheet, CheckCircle, Users } from 'lucide-react'

export default function TeacherImport() {
  const { addNotification, NotificationContainer } = useNotification()
  const [importHistory, setImportHistory] = useState([
    {
      id: 1,
      type: 'students',
      count: 25,
      date: '2024-11-06',
      time: '11:45 AM',
      status: 'success',
      class: 'CS501-A',
      importedBy: 'Dr. Priya Sharma'
    },
    {
      id: 2,
      type: 'students',
      count: 18,
      date: '2024-11-05',
      time: '03:20 PM',
      status: 'success',
      class: 'CS502-B',
      importedBy: 'Dr. Priya Sharma'
    }
  ])

  const teacherInfo = {
    name: "Dr. Priya Sharma",
    employeeId: "EMP001",
    designation: "Associate Professor"
  }

  const handleImportComplete = (data, type) => {
    console.log('Import completed:', { data, type })
    
    // Add to import history
    const newImport = {
      id: importHistory.length + 1,
      type,
      count: data.length,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      status: 'success',
      class: 'CS501-A', // This would be dynamic based on selected class
      importedBy: teacherInfo.name
    }
    
    setImportHistory(prev => [newImport, ...prev])
    addNotification('success', `Successfully imported ${data.length} students to your class!`)
  }

  const getImportStats = () => {
    const totalStudents = importHistory.reduce((sum, item) => sum + item.count, 0)
    return { totalStudents, totalImports: importHistory.length }
  }

  const stats = getImportStats()

  return (
    <>
      <NotificationContainer />
      <DashboardLayout
        userInfo={teacherInfo}
        currentPage="import"
        userType="teacher"
        title="KMBB CET"
        subtitle="Student Import System"
      >
        <div className="p-8 space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Student Import System
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Import multiple students to your classes using Excel/CSV files
            </p>
          </div>

          {/* Import Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Imports</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.totalImports}</p>
                  </div>
                  <Upload className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Students Imported</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.totalStudents}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Success Rate</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">100%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Permission Notice */}
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-300">Teacher Import Permissions</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-400 mt-1">
                    As a teacher, you can import students to your assigned classes. 
                    Students will be automatically assigned to your selected class during import.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Import Interface */}
          <RoleBasedImport
            userRole="teacher"
            onImportComplete={handleImportComplete}
          />

          {/* Import History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5" />
                <span>Import History</span>
              </CardTitle>
              <CardDescription>
                Your recent student import operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importHistory.length > 0 ? (
                  importHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                          <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            Imported {item.count} students to {item.class}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item.date} at {item.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          Success
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No import history yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  )
}