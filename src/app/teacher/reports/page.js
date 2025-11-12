'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Download, Filter, Users, TrendingUp, Clock } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

export default function TeacherReports() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data.classes || [])
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const generateReport = async () => {
    if (!selectedClass) {
      alert('Please select a class')
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({ classId: selectedClass })
      if (dateRange.start) params.append('startDate', dateRange.start)
      if (dateRange.end) params.append('endDate', dateRange.end)

      const response = await fetch(`/api/attendance?${params}`)
      const data = await response.json()
      
      // Process data for report
      const students = {}
      data.records?.forEach(record => {
        const studentId = record.student.id
        if (!students[studentId]) {
          students[studentId] = {
            name: record.student.user.name,
            rollNo: record.student.rollNo,
            present: 0,
            absent: 0,
            total: 0
          }
        }
        students[studentId].total++
        if (record.status === 'present') students[studentId].present++
        else students[studentId].absent++
      })

      setReportData(Object.values(students))
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!reportData) return

    const csv = [
      ['Name', 'Roll No', 'Present', 'Absent', 'Total', 'Percentage'].join(','),
      ...reportData.map(s => 
        [s.name, s.rollNo, s.present, s.absent, s.total, 
         ((s.present / s.total) * 100).toFixed(2) + '%'].join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-gray-600 mt-2">Generate and download attendance reports for your classes</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Report Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.code} - {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <Button onClick={generateReport} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              {reportData && (
                <Button onClick={downloadReport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {reportData && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance Report</CardTitle>
              <CardDescription>
                Showing {reportData.length} students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Roll No</th>
                      <th className="text-center py-3 px-4">Present</th>
                      <th className="text-center py-3 px-4">Absent</th>
                      <th className="text-center py-3 px-4">Total</th>
                      <th className="text-center py-3 px-4">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((student, idx) => {
                      const percentage = (student.present / student.total) * 100
                      return (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4">{student.rollNo}</td>
                          <td className="text-center py-3 px-4 text-green-600 font-medium">
                            {student.present}
                          </td>
                          <td className="text-center py-3 px-4 text-red-600 font-medium">
                            {student.absent}
                          </td>
                          <td className="text-center py-3 px-4">{student.total}</td>
                          <td className="text-center py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              percentage >= 75 ? 'bg-green-100 text-green-800' :
                              percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
