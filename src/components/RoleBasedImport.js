'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExcelImport } from '@/components/ExcelImport'
import { 
  Upload, 
  Users, 
  GraduationCap, 
  Shield, 
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useNotification } from '@/components/Notification'

export function RoleBasedImport({ userRole = 'principal', onImportComplete, className = '' }) {
  const [showImport, setShowImport] = useState(false)
  const [importType, setImportType] = useState('students')
  const { addNotification } = useNotification()

  const canImportTeachers = userRole === 'principal'
  const canImportStudents = userRole === 'principal' || userRole === 'teacher'

  const handleImportComplete = (data) => {
    onImportComplete?.(data, importType)
    setShowImport(false)
  }

  const getRolePermissions = () => {
    switch (userRole) {
      case 'principal':
        return {
          title: 'Principal Import Permissions',
          description: 'As a Principal, you can import both teachers and students',
          permissions: [
            { type: 'teachers', label: 'Import Teachers', icon: Users, allowed: true },
            { type: 'students', label: 'Import Students', icon: GraduationCap, allowed: true }
          ]
        }
      case 'teacher':
        return {
          title: 'Teacher Import Permissions',
          description: 'As a Teacher, you can import students to your classes',
          permissions: [
            { type: 'teachers', label: 'Import Teachers', icon: Users, allowed: false },
            { type: 'students', label: 'Import Students', icon: GraduationCap, allowed: true }
          ]
        }
      default:
        return {
          title: 'No Import Permissions',
          description: 'You do not have permission to import users',
          permissions: []
        }
    }
  }

  const permissions = getRolePermissions()

  if (!canImportStudents && !canImportTeachers) {
    return (
      <Card className={`border-red-200 dark:border-red-800 ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 dark:text-red-300 mb-2">
            No Import Permissions
          </h3>
          <p className="text-red-700 dark:text-red-400">
            You do not have permission to import users into the system.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Role Permissions Display */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-300">
            <Shield className="w-5 h-5" />
            <span>{permissions.title}</span>
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-400">
            {permissions.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.permissions.map((perm) => {
              const Icon = perm.icon
              return (
                <div
                  key={perm.type}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    perm.allowed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${
                      perm.allowed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`} />
                    <span className={`font-medium ${
                      perm.allowed ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                    }`}>
                      {perm.label}
                    </span>
                  </div>
                  {perm.allowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Import Actions */}
      {!showImport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Bulk Import Options</span>
            </CardTitle>
            <CardDescription>
              Choose what type of users you want to import
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {canImportTeachers && (
                <Button
                  onClick={() => {
                    setImportType('teachers')
                    setShowImport(true)
                  }}
                  className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="w-8 h-8" />
                  <span>Import Teachers</span>
                </Button>
              )}
              
              {canImportStudents && (
                <Button
                  onClick={() => {
                    setImportType('students')
                    setShowImport(true)
                  }}
                  className="h-20 flex-col space-y-2 bg-green-600 hover:bg-green-700"
                >
                  <GraduationCap className="w-8 h-8" />
                  <span>Import Students</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Interface */}
      {showImport && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {importType === 'teachers' ? (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Import Teachers</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5" />
                      <span>Import Students</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  Upload Excel/CSV file to import multiple {importType}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowImport(false)}
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ExcelImport
              type={importType}
              onImportComplete={handleImportComplete}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function QuickImportButtons({ userRole = 'principal', onImportClick, className = '' }) {
  const canImportTeachers = userRole === 'principal'
  const canImportStudents = userRole === 'principal' || userRole === 'teacher'

  if (!canImportStudents && !canImportTeachers) {
    return null
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {canImportTeachers && (
        <Button
          onClick={() => onImportClick('teachers')}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <Users className="w-4 h-4 mr-2" />
          Import Teachers
        </Button>
      )}
      
      {canImportStudents && (
        <Button
          onClick={() => onImportClick('students')}
          variant="outline"
          className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          Import Students
        </Button>
      )}
    </div>
  )
}