import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const studentCount = await prisma.student.count()
    const teacherCount = await prisma.teacher.count()
    
    // Get sample students
    const students = await prisma.student.findMany({
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({
      status: 'Database connected',
      counts: {
        users: userCount,
        students: studentCount,
        teachers: teacherCount
      },
      sampleStudents: students.map(s => ({
        id: s.id,
        rollNo: s.rollNo,
        name: s.user.name,
        email: s.user.email,
        department: s.department
      }))
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        status: 'Database error',
        error: error.message 
      },
      { status: 500 }
    )
  }
}
