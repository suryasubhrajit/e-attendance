import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const classId = searchParams.get('classId')
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }
    
    let where = { studentId }
    
    // If classId is provided, filter through attendanceRecord
    if (classId) {
      where.attendanceRecord = {
        classId: classId
      }
    }
    
    const totalRecords = await prisma.attendance.count({ where })
    const presentRecords = await prisma.attendance.count({
      where: {
        ...where,
        status: 'present'
      }
    })
    
    const percentage = totalRecords > 0 
      ? ((presentRecords / totalRecords) * 100).toFixed(2)
      : 0
    
    return NextResponse.json({
      total: totalRecords,
      present: presentRecords,
      absent: totalRecords - presentRecords,
      percentage: parseFloat(percentage)
    })
  } catch (error) {
    console.error('Error fetching attendance stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance statistics' },
      { status: 500 }
    )
  }
}
