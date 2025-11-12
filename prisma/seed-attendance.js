const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting attendance data seed...')

  // Get the teacher
  const teacher = await prisma.teacher.findFirst({
    where: { employeeId: 'EMP001' }
  })

  if (!teacher) {
    console.error('❌ Teacher not found. Please run the main seed first.')
    return
  }

  // Get the first class (CS501-A)
  const classData = await prisma.class.findFirst({
    where: { code: 'CS501-A' },
    include: {
      students: {
        include: {
          student: true
        }
      }
    }
  })

  if (!classData) {
    console.error('❌ Class not found. Please run the main seed first.')
    return
  }

  console.log(`📚 Found class: ${classData.name} with ${classData.students.length} students`)

  // Generate attendance for the last 30 days
  const today = new Date()
  const daysToGenerate = 30
  const attendanceStatuses = ['present', 'absent', 'late']

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    // Create attendance record for the day
    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: {
        classId_date: {
          classId: classData.id,
          date: date
        }
      }
    })

    let attendanceRecord
    if (existingRecord) {
      attendanceRecord = existingRecord
      console.log(`⏭️  Attendance record already exists for ${date.toDateString()}`)
    } else {
      attendanceRecord = await prisma.attendanceRecord.create({
        data: {
          classId: classData.id,
          teacherId: teacher.id,
          date: date,
          startTime: new Date(date.setHours(9, 0, 0)),
          endTime: new Date(date.setHours(10, 0, 0)),
          status: 'completed'
        }
      })
      console.log(`✅ Created attendance record for ${date.toDateString()}`)
    }

    // Mark attendance for each student
    for (const studentClass of classData.students) {
      const existingAttendance = await prisma.attendance.findUnique({
        where: {
          studentId_attendanceRecordId: {
            studentId: studentClass.studentId,
            attendanceRecordId: attendanceRecord.id
          }
        }
      })

      if (!existingAttendance) {
        // Randomly assign status with weighted probability
        // 75% present, 15% absent, 10% late
        const random = Math.random()
        let status
        if (random < 0.75) {
          status = 'present'
        } else if (random < 0.90) {
          status = 'absent'
        } else {
          status = 'late'
        }

        await prisma.attendance.create({
          data: {
            attendanceRecordId: attendanceRecord.id,
            studentId: studentClass.studentId,
            status: status,
            date: date,
            topic: `Lecture ${i + 1}`
          }
        })
      }
    }
  }

  // Print summary
  const totalRecords = await prisma.attendanceRecord.count({
    where: { classId: classData.id }
  })

  const totalAttendances = await prisma.attendance.count({
    where: {
      attendanceRecord: {
        classId: classData.id
      }
    }
  })

  const presentCount = await prisma.attendance.count({
    where: {
      attendanceRecord: {
        classId: classData.id
      },
      status: 'present'
    }
  })

  const absentCount = await prisma.attendance.count({
    where: {
      attendanceRecord: {
        classId: classData.id
      },
      status: 'absent'
    }
  })

  const lateCount = await prisma.attendance.count({
    where: {
      attendanceRecord: {
        classId: classData.id
      },
      status: 'late'
    }
  })

  console.log('\n📊 Attendance Summary:')
  console.log(`Total attendance records: ${totalRecords}`)
  console.log(`Total attendance entries: ${totalAttendances}`)
  console.log(`Present: ${presentCount} (${((presentCount/totalAttendances)*100).toFixed(1)}%)`)
  console.log(`Absent: ${absentCount} (${((absentCount/totalAttendances)*100).toFixed(1)}%)`)
  console.log(`Late: ${lateCount} (${((lateCount/totalAttendances)*100).toFixed(1)}%)`)
  console.log('\n🎉 Attendance data seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
