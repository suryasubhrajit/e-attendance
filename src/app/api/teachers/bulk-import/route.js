import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { teachers } = body

    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid teachers data' },
        { status: 400 }
      )
    }

    const results = {
      success: [],
      errors: []
    }

    // Process each teacher
    for (const teacherData of teachers) {
      try {
        const { 
          name, 
          email, 
          employeeId, 
          department,
          designation,
          phone
        } = teacherData

        // Validate required fields
        if (!name || !email || !employeeId) {
          results.errors.push({
            data: teacherData,
            error: 'Missing required fields (name, email, employeeId)'
          })
          continue
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email }
        })

        if (existingUser) {
          results.errors.push({
            data: teacherData,
            error: `User with email ${email} already exists`
          })
          continue
        }

        // Check if employee ID already exists
        const existingTeacher = await prisma.teacher.findUnique({
          where: { employeeId }
        })

        if (existingTeacher) {
          results.errors.push({
            data: teacherData,
            error: `Teacher with employee ID ${employeeId} already exists`
          })
          continue
        }

        // Generate default password
        const defaultPassword = `${employeeId}@123`
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)

        // Create user and teacher in a transaction
        const result = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              name,
              email,
              role: 'teacher',
              password: hashedPassword
            }
          })

          const teacher = await tx.teacher.create({
            data: {
              userId: user.id,
              employeeId,
              department: department || 'Computer Science Engineering'
            }
          })

          return { user, teacher }
        })

        results.success.push({
          employeeId,
          name,
          email
        })

      } catch (error) {
        console.error(`Error creating teacher ${teacherData.employeeId}:`, error)
        results.errors.push({
          data: teacherData,
          error: error.message
        })
      }
    }

    return NextResponse.json({ 
      message: `Imported ${results.success.length} teachers successfully`,
      results
    })

  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Failed to import teachers' },
      { status: 500 }
    )
  }
}
