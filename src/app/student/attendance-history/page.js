'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

export default function AttendanceHistory() {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterClass, setFilterClass] = useState('all')

  useEffect(() => {
    fetchAttendanceHistory()
  }, [])

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true)
      const studentId = localStorage.getItem('userId')
      
      const response = await fetch(`/api/attendance?studentId=${studentId}`)
      const data = await response.json()
      
      setAttendanceRecords(data.records || [])
    } catch (error) {
      console.error('Error fetching attendance history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'absent': return <XCircle className="w-5 h-5 text-red-500" />
      case 'late': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default: return null
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800'
    }
    return `px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`
  }

  const classes = ['all', ...new Set(attendanceRecords.map(r => r.attendanceRecord?.class?.name).filter(Boolean))]

  const filteredRecords = attendanceRecords.filter(record => {
    const statusMatch = filterStatus === 'all' || record.status === filterStatus
    const classMatch = filterClass === 'all' || record.attendanceRecord?.class?.name === filterClass
    return statusMatch && classMatch
  })

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
  }
  const percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0

  return (
    <DashboardLayout role="student">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
          <p className="text-gray-600 mt-2">View your complete attendance records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.present}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Attendance %</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{percentage}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>
                      {cls === 'all' ? 'All Classes' : cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>Showing {filteredRecords.length} records</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No attendance records found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Class</th>
                      <th className="text-left py-3 px-4">Topic</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{record.attendanceRecord?.class?.name}</p>
                            <p className="text-sm text-gray-500">{record.attendanceRecord?.class?.code}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {record.topic || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            {getStatusIcon(record.status)}
                            <span className={getStatusBadge(record.status)}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
