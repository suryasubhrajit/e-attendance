'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, FileSpreadsheet, Users } from 'lucide-react'

export function ImportInstructions({ type = 'students' }) {
  const isStudent = type === 'students'
  
  const requiredFields = isStudent 
    ? ['Full Name', 'Roll Number', 'Email', 'Phone', 'Department', 'Semester', 'Batch', 'Section']
    : ['Full Name', 'Employee ID', 'Email', 'Phone', 'Department', 'Designation']
    
  const optionalFields = isStudent
    ? ['Father Name', 'Mother Name', 'Blood Group', 'Category', 'Address', 'Admission Year']
    : ['Qualification', 'Experience Years', 'Specialization', 'Date of Joining', 'Address']

  const formatRules = isStudent ? [
    'Roll Number: Format should be YYYYDDDNNN (e.g., 2024CSE001)',
    'Email: Must be valid email format ending with @kmbb.in',
    'Department: Use department codes (cse, me, ee, ce, ece)',
    'Semester: Numbers 1-8 only',
    'Section: Single letter (A, B, C, D)',
    'Blood Group: A+, A-, B+, B-, AB+, AB-, O+, O-',
    'Category: General, OBC, SC, ST, EWS'
  ] : [
    'Employee ID: Format should be EMPNNN (e.g., EMP001)',
    'Email: Must be valid email format ending with @kmbb.in',
    'Department: Use department codes (cse, me, ee, ce, ece)',
    'Designation: Professor, Associate Professor, Assistant Professor, Lecturer, Lab Assistant'
  ]

  return (
    <div className="space-y-4">
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-300">
            <FileSpreadsheet className="w-5 h-5" />
            <span>Import Instructions</span>
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-400">
            Follow these guidelines for successful {type} import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Required Fields */}
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Required Fields
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {requiredFields.map((field, index) => (
                <div key={index} className="text-sm text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {field}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Optional Fields
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {optionalFields.map((field, index) => (
                <div key={index} className="text-sm text-blue-700 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
                  {field}
                </div>
              ))}
            </div>
          </div>

          {/* Format Rules */}
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Format Rules</h4>
            <ul className="space-y-1">
              {formatRules.map((rule, index) => (
                <li key={index} className="text-sm text-blue-800 dark:text-blue-400 flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Department Codes */}
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Department Codes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-blue-800 dark:text-blue-400">• cse - Computer Science Engineering</div>
              <div className="text-blue-800 dark:text-blue-400">• me - Mechanical Engineering</div>
              <div className="text-blue-800 dark:text-blue-400">• ee - Electrical Engineering</div>
              <div className="text-blue-800 dark:text-blue-400">• ce - Civil Engineering</div>
              <div className="text-blue-800 dark:text-blue-400">• ece - Electronics & Communication</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-green-900 dark:text-green-300 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Pro Tips
          </h4>
          <ul className="space-y-1 text-sm text-green-800 dark:text-green-400">
            <li>• Download the template first to see the exact format required</li>
            <li>• Keep your data in the same order as the template headers</li>
            <li>• Remove any empty rows at the end of your file</li>
            <li>• Use CSV format for best compatibility</li>
            <li>• Double-check email addresses and phone numbers</li>
            <li>• Ensure roll numbers/employee IDs are unique</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}