'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Clock, BookOpen, Users } from 'lucide-react'
import { getDepartmentById } from '@/data/departments'

export function DepartmentCard({ departmentId, className = '' }) {
  const department = getDepartmentById(departmentId)
  
  if (!department) return null

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-300">
          <Building className="w-5 h-5" />
          <span>{department.shortName} - {department.name}</span>
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-400">
          {department.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Duration: {department.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Semesters: {department.totalSemesters}</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Key Subjects
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {department.subjects.slice(0, 6).map((subject, index) => (
              <div key={index} className="text-sm text-blue-700 dark:text-blue-400">
                • {subject}
              </div>
            ))}
          </div>
          {department.subjects.length > 6 && (
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
              +{department.subjects.length - 6} more subjects
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function DepartmentBadge({ departmentId, showFullName = false }) {
  const department = getDepartmentById(departmentId)
  
  if (!department) return null

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
      <Building className="w-3 h-3 mr-1" />
      {showFullName ? department.name : department.shortName}
    </span>
  )
}

export function DepartmentStats({ departmentId, studentCount, teacherCount }) {
  const department = getDepartmentById(departmentId)
  
  if (!department) return null

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">{department.shortName}</h3>
          <DepartmentBadge departmentId={departmentId} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{department.name}</p>
        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">{studentCount} Students</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4 text-green-500" />
            <span className="text-slate-600 dark:text-slate-400">{teacherCount} Teachers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}