'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { RoleBasedImport } from '@/components/RoleBasedImport'
import { useNotification } from '@/components/Notification'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Users, GraduationCap, FileSpreadsheet, CheckCircle } from 'lucide-react'

export default function AdminImport() {
  const { addNotification, NotificationContainer } = useNotification()
  const [importHistory, setImportHistory] = useState([
    {
      id: 1,
      type: 'students',
      count: 45,
      date: '2024-11-06',
      time: '10:30 AM',
      status: 'success',
      importedBy: 'Dr. Rajesh Kumar'
    },
    {
      id: 2,
      type: 'teachers',
      count: 8,
      date: '2024-11-05',
      time: '02:15 PM',
      status: 'success',
      importedBy: 'Dr. Rajesh Kumar'
    }
  ])

  const adminInfo = {
    name: "Dr. Rajesh Kumar",
    employeeId: "PRIN001",
    designation: "Principal"
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
      importedBy: adminInfo.name
    }
    
    setImportHistory(prev => [newImport, ...prev])
    addNotification('success', `Successfully imported ${data.length} ${type}!`)
  }

  const getImportStats = () => {
    const totalStudents = importHistory
      .filter(item => item.type === 'students')
      .reduce((sum, item) => sum + item.count, 0)
    
    const totalTeachers = importHistory
      .filter(item => item.type === 'teachers')
      .reduce((sum, item) => sum + item.count, 0)
    
    return { totalStudents, totalTeachers, totalImports: importHistory.length }
  }

  const stats = getImportStats()

  return (
    <>
      <NotificationContainer />
      <DashboardLayout
        userInfo={adminInfo}
        currentPage="import"
        userType="admin"
        title="KMBB CET"
        subtitle="Bulk Import System"
      >
        <div className="p-8 space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Bulk Import System
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Import multiple teachers and students using Excel/CSV files
            </p>
          </div>

          {/* Import Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Teachers Imported</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats.totalTeachers}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500 dark:text-purple-400" />
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

          {/* Main Import Interface */}
          <RoleBasedImport
            userRole="principal"
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
                Recent bulk import operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importHistory.length > 0 ? (
                  importHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          item.type === 'students' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {item.type === 'students' ? (
                            <GraduationCap className={`w-5 h-5 ${
                              item.type === 'students' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }`} />
                          ) : (
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            Imported {item.count} {item.type}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item.date} at {item.time} by {item.importedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'success'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {item.status === 'success' ? 'Success' : 'Failed'}
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