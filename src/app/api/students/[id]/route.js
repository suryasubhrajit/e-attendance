import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH - Update student information (limited fields)
export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Only allow updating specific fields
    const allowedFields = {
      phone: body.phone,
      fatherName: body.fatherName,
      motherName: body.motherName,
      bloodGroup: body.bloodGroup,
      category: body.category,
      address: body.address
    }

    // Remove undefined fields
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] === undefined) {
        delete allowedFields[key]
      }
    })

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: allowedFields,
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
      success: true,
      student: updatedStudent
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Failed to update student information' },
      { status: 500 }
    )
  }
}

// DELETE - Remove student (optional, for future use)
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.student.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
