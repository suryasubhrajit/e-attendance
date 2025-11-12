import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all classes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')
    
    let classes
    
    if (teacherId) {
      // Get classes for a specific teacher
      classes = await prisma.class.findMany({
        where: {
          teacherId: teacherId
        },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          students: {
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
              }
            }
          },
          _count: {
            select: {
              students: true
            }
          }
        }
      })
    } else {
      // Get all classes
      classes = await prisma.class.findMany({
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              students: true
            }
          }
        }
      })
    }
    
    return NextResponse.json({ classes })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

// POST - Create new class
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      name, 
      code, 
      semester, 
      batch, 
      department, 
      teacherId 
    } = body

    // Validate required fields
    if (!name || !code || !teacherId) {
      return NextResponse.json(
        { error: 'Name, code, and teacher ID are required' },
        { status: 400 }
      )
    }

    // Check if class code already exists
    const existingClass = await prisma.class.findUnique({
      where: { code }
    })

    if (existingClass) {
      return NextResponse.json(
        { error: 'Class with this code already exists' },
        { status: 400 }
      )
    }

    // Verify teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name,
        code,
        semester: semester || '1st',
        batch: batch || '2024-2028',
        department: department || 'Computer Science Engineering',
        teacherId
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Class created successfully',
      class: newClass
    })

  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}