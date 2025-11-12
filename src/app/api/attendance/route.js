import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET attendance records
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')
    
    let where = {}
    
    if (studentId) where.studentId = studentId
    if (date) where.date = new Date(date)
    
    // If classId is provided, filter through attendanceRecord
    if (classId) {
      where.attendanceRecord = {
        classId: classId
      }
    }
    
    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
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
      }
    })
    
    return NextResponse.json({ records })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

// POST - Mark attendance for a session
export async function POST(request) {
  try {
    const body = await request.json()
    const { classId, teacherId = 'temp-teacher-id', date, attendanceData, topic } = body
    
    if (!classId || !date || !attendanceData) {
      return NextResponse.json(
        { error: 'Class ID, date, and attendance data are required' },
        { status: 400 }
      )
    }
    
    // Create or get attendance record for this session
    const dateObj = new Date(date)
    
    // Find existing record or create new one
    let attendanceRecord = await prisma.attendanceRecord.findFirst({
      where: {
        classId,
        date: dateObj
      }
    })
    
    if (!attendanceRecord) {
      attendanceRecord = await prisma.attendanceRecord.create({
        data: {
          classId,
          teacherId,
          date: dateObj,
          status: 'completed'
        }
      })
    } else {
      attendanceRecord = await prisma.attendanceRecord.update({
        where: { id: attendanceRecord.id },
        data: { status: 'completed' }
      })
    }
    
    // Create individual attendance records
    const results = await prisma.$transaction(
      attendanceData.map(record =>
        prisma.attendance.upsert({
          where: {
            studentId_attendanceRecordId: {
              studentId: record.studentId,
              attendanceRecordId: attendanceRecord.id
            }
          },
          update: {
            status: record.status
          },
          create: {
            attendanceRecordId: attendanceRecord.id,
            studentId: record.studentId,
            date: dateObj,
            status: record.status
          }
        })
      )
    )
    
    return NextResponse.json({ 
      message: 'Attendance marked successfully',
      count: results.length
    })
  } catch (error) {
    console.error('Error marking attendance:', error)
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    )
  }
}
