import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET all students
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    
    let students
    
    if (classId) {
      // Get students for a specific class
      students = await prisma.student.findMany({
        where: {
          classes: {
            some: {
              classId: classId
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          classes: {
            include: {
              class: true
            }
          }
        }
      })
    } else {
      // Get all students
      students = await prisma.student.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          classes: {
            include: {
              class: true
            }
          }
        }
      })
    }
    
    return NextResponse.json({ students })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST - Create new student
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      rollNo, 
      phone, 
      semester, 
      batch, 
      section, 
      department, 
      departmentCode,
      fatherName,
      motherName,
      bloodGroup,
      category,
      address,
      admissionYear,
      classId
    } = body

    // Validate required fields
    if (!name || !email || !rollNo) {
      return NextResponse.json(
        { error: 'Name, email, and roll number are required' },
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

    // Check if roll number already exists
    const existingStudent = await prisma.student.findUnique({
      where: { rollNo }
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this roll number already exists' },
        { status: 400 }
      )
    }

    // Generate default password (rollNo@123)
    const defaultPassword = `${rollNo}@123`
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Create user and student in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          role: 'student',
          password: hashedPassword
        }
      })

      // Create student
      const student = await tx.student.create({
        data: {
          userId: user.id,
          rollNo,
          phone: phone || null,
          semester: semester || '1st',
          batch: batch || '2024-2028',
          section: section || 'A',
          department: department || 'Computer Science Engineering',
          departmentCode: departmentCode || 'CSE',
          fatherName: fatherName || null,
          motherName: motherName || null,
          bloodGroup: bloodGroup || null,
          category: category || 'General',
          address: address || null,
          admissionYear: admissionYear || new Date().getFullYear().toString()
        }
      })

      // If classId is provided, enroll student in class
      if (classId) {
        await tx.studentClass.create({
          data: {
            studentId: student.id,
            classId: classId
          }
        })
      }

      return { user, student }
    })

    return NextResponse.json({ 
      message: 'Student created successfully',
      student: result.student,
      defaultPassword
    })

  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}