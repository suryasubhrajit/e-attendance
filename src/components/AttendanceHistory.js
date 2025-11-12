'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

export function AttendanceHistory({ studentId, studentName }) {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (studentId) {
      loadHistory()
    }
  }, [studentId])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/attendance/history?studentId=${studentId}&limit=100`)
      const data = await response.json()
      
      if (response.ok) {
        setHistory(data.history || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Error loading attendance history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300'
      case 'absent': return 'bg-red-100 text-red-800 border-red-300'
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading attendance history...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lifetime Attendance Statistics</span>
              {studentName && <span className="text-sm font-normal text-gray-500">{studentName}</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Classes</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-sm text-gray-600">Absent</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                stats.percentage >= 75 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {stats.percentage >= 75 ? (
                  <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${
                    stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'
                  }`} />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                )}
                <p className={`text-2xl font-bold ${
                  stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.percentage}%
                </p>
                <p className="text-sm text-gray-600">Percentage</p>
              </div>
            </div>
            
            {stats.percentage < 75 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>⚠️ Warning:</strong> Attendance is below 75%. 
                  Need {Math.ceil((0.75 * (stats.total + 1)) - stats.present)} more classes to reach 75%.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Class</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Topic</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{record.className}</p>
                          <p className="text-xs text-gray-500">{record.classCode}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {record.topic || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status === 'present' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {record.status === 'absent' && <XCircle className="w-3 h-3 mr-1" />}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
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
  )
}
