import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET all teachers
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({ teachers })
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    )
  }
}

// POST - Create new teacher
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      employeeId, 
      department,
      designation,
      phone,
      password,
      isHOD
    } = body

    // Validate required fields
    if (!name || !email || !employeeId) {
      return NextResponse.json(
        { error: 'Name, email, and employee ID are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check if employee ID already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { employeeId }
    })

    if (existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher with this employee ID already exists' },
        { status: 400 }
      )
    }

    // Generate default password if not provided
    const defaultPassword = password || `${employeeId}@123`
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Create user and teacher in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          role: 'teacher',
          password: hashedPassword
        }
      })

      // Create teacher
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          employeeId,
          department: department || 'Computer Science Engineering',
          isHOD: isHOD || false
        }
      })

      return { user, teacher }
    })

    return NextResponse.json({ 
      message: 'Teacher created successfully',
      teacher: result.teacher,
      defaultPassword
    })

  } catch (error) {
    console.error('Error creating teacher:', error)
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    )
  }
}

// PATCH - Update teacher (e.g., HOD status)
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { teacherId, isHOD } = body

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      )
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: { isHOD: isHOD },
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
      message: 'Teacher updated successfully',
      teacher: updatedTeacher
    })
  } catch (error) {
    console.error('Error updating teacher:', error)
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    )
  }
}