const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kmbb.in' },
    update: {},
    create: {
      email: 'admin@kmbb.in',
      name: 'System Administrator',
      role: 'admin',
      password: adminPassword,
      admin: {
        create: {}
      }
    }
  })

  // Create teacher user
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacherUser = await prisma.user.upsert({
    where: { email: 'priya.sharma@kmbb.in' },
    update: {},
    create: {
      email: 'priya.sharma@kmbb.in',
      name: 'Dr. Priya Sharma',
      role: 'teacher',
      password: teacherPassword,
      teacher: {
        create: {
          employeeId: 'EMP001',
          department: 'Computer Science Engineering'
        }
      }
    }
  })

  // Get the teacher record
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherUser.id }
  })

  // Create classes
  const classes = [
    {
      name: 'Software Engineering',
      code: 'CS501-A',
      semester: '5th',
      batch: '2021-2025',
      department: 'Computer Science Engineering',
      teacherId: teacher.id
    },
    {
      name: 'Database Management',
      code: 'CS502-B',
      semester: '5th',
      batch: '2021-2025',
      department: 'Computer Science Engineering',
      teacherId: teacher.id
    },
    {
      name: 'Data Structures',
      code: 'CS301-A',
      semester: '3rd',
      batch: '2022-2026',
      department: 'Computer Science Engineering',
      teacherId: teacher.id
    }
  ]

  const createdClasses = []
  for (const classData of classes) {
    const existingClass = await prisma.class.findUnique({
      where: { code: classData.code }
    })

    if (!existingClass) {
      const newClass = await prisma.class.create({
        data: classData
      })
      createdClasses.push(newClass)
      console.log(`✅ Created class: ${newClass.name} (${newClass.code})`)
    } else {
      createdClasses.push(existingClass)
      console.log(`⏭️  Class already exists: ${existingClass.name} (${existingClass.code})`)
    }
  }

  // Create sample students
  const sampleStudents = [
    {
      name: 'Rahul Kumar',
      email: 'rahul.kumar@kmbb.in',
      rollNo: '2021001234',
      phone: '+91 8765432109',
      semester: '5th',
      batch: '2021-2025',
      section: 'A',
      department: 'Computer Science Engineering',
      departmentCode: 'CSE',
      fatherName: 'Suresh Kumar',
      bloodGroup: 'B+',
      category: 'General'
    },
    {
      name: 'Priya Singh',
      email: 'priya.singh@kmbb.in',
      rollNo: '2021001235',
      phone: '+91 8765432108',
      semester: '5th',
      batch: '2021-2025',
      section: 'A',
      department: 'Computer Science Engineering',
      departmentCode: 'CSE',
      fatherName: 'Rajesh Singh',
      bloodGroup: 'A+',
      category: 'OBC'
    },
    {
      name: 'Amit Patel',
      email: 'amit.patel@kmbb.in',
      rollNo: '2021001236',
      phone: '+91 8765432107',
      semester: '5th',
      batch: '2021-2025',
      section: 'A',
      department: 'Computer Science Engineering',
      departmentCode: 'CSE',
      fatherName: 'Kishore Patel',
      bloodGroup: 'O+',
      category: 'General'
    }
  ]

  for (const studentData of sampleStudents) {
    const existingUser = await prisma.user.findUnique({
      where: { email: studentData.email }
    })

    if (!existingUser) {
      const studentPassword = await bcrypt.hash(`${studentData.rollNo}@123`, 10)

      const user = await prisma.user.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          role: 'student',
          password: studentPassword
        }
      })

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          rollNo: studentData.rollNo,
          phone: studentData.phone,
          semester: studentData.semester,
          batch: studentData.batch,
          section: studentData.section,
          department: studentData.department,
          departmentCode: studentData.departmentCode,
          fatherName: studentData.fatherName,
          bloodGroup: studentData.bloodGroup,
          category: studentData.category,
          admissionYear: '2021'
        }
      })

      // Enroll student in first class (CS501-A)
      await prisma.studentClass.create({
        data: {
          studentId: student.id,
          classId: createdClasses[0].id
        }
      })

      console.log(`✅ Created student: ${studentData.name} (${studentData.rollNo})`)
    } else {
      console.log(`⏭️  Student already exists: ${studentData.name}`)
    }
  }

  console.log('🎉 Database seed completed!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@kmbb.in / admin123')
  console.log('Teacher: priya.sharma@kmbb.in / teacher123')
  console.log('Students: [rollNo]@123 (e.g., 2021001234@123)')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })