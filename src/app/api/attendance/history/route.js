import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

// GET attendance history for a student
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }
    
    // Get all attendance records for the student
    const history = await prisma.attendance.findMany({
      where: {
        studentId: studentId
      },
      include: {
        attendanceRecord: {
          include: {
            class: {
              select: {
                name: true,
                code: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    })
    
    // Get overall statistics
    const totalRecords = await prisma.attendance.count({
      where: { studentId }
    })
    
    const presentRecords = await prisma.attendance.count({
      where: {
        studentId,
        status: 'present'
      }
    })
    
    const absentRecords = await prisma.attendance.count({
      where: {
        studentId,
        status: 'absent'
      }
    })
    
    const percentage = totalRecords > 0 
      ? ((presentRecords / totalRecords) * 100).toFixed(2)
      : 0
    
    return NextResponse.json({
      history: history.map(record => ({
        id: record.id,
        date: record.date,
        status: record.status,
        topic: record.topic,
        className: record.attendanceRecord.class.name,
        classCode: record.attendanceRecord.class.code,
        markedAt: record.markedAt
      })),
      stats: {
        total: totalRecords,
        present: presentRecords,
        absent: absentRecords,
        percentage: parseFloat(percentage)
      }
    })
  } catch (error) {
    console.error('Error fetching attendance history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance history' },
      { status: 500 }
    )
  }
}
