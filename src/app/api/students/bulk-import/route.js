import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { students, classId } = body

    console.log('Bulk import API called with', students?.length, 'students', classId ? `for class ${classId}` : '')

    if (!students || !Array.isArray(students) || students.length === 0) {
      console.error('Invalid students data received')
      return NextResponse.json(
        { error: 'Invalid students data' },
        { status: 400 }
      )
    }

    const results = {
      success: [],
      errors: []
    }

    // Process each student
    for (const studentData of students) {
      console.log('Processing student:', studentData.name, studentData.rollNo)
      try {
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
          admissionYear
        } = studentData

        // Validate required fields
        if (!name || !email || !rollNo) {
          results.errors.push({
            data: studentData,
            error: 'Missing required fields (name, email, rollNo)'
          })
          continue
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email }
        })

        if (existingUser) {
          results.errors.push({
            data: studentData,
            error: `User with email ${email} already exists`
          })
          continue
        }

        // Check if roll number already exists
        const existingStudent = await prisma.student.findUnique({
          where: { rollNo }
        })

        if (existingStudent) {
          results.errors.push({
            data: studentData,
            error: `Student with roll number ${rollNo} already exists`
          })
          continue
        }

        // Generate default password
        const defaultPassword = `${rollNo}@123`
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)

        // Create user and student in a transaction
        const result = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              name,
              email,
              role: 'student',
              password: hashedPassword
            }
          })

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

          // If classId is provided, enroll student in that class
          if (classId) {
            await tx.studentClass.create({
              data: {
                studentId: student.id,
                classId: classId
              }
            })
            console.log('Enrolled student', rollNo, 'in class', classId)
          }

          return { user, student }
        })

        console.log('Successfully created student:', rollNo, name)
        results.success.push({
          rollNo,
          name,
          email
        })

      } catch (error) {
        console.error(`Error creating student ${studentData.rollNo}:`, error)
        results.errors.push({
          data: studentData,
          error: error.message
        })
      }
    }

    console.log('Bulk import complete. Success:', results.success.length, 'Errors:', results.errors.length)

    return NextResponse.json({ 
      message: `Imported ${results.success.length} students successfully`,
      results
    })

  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Failed to import students' },
      { status: 500 }
    )
  }
}
