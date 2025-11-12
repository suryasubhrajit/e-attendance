const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking for email conflicts...\n')

  // Find the student Priya Sharma with old email
  const studentPriya = await prisma.user.findFirst({
    where: {
      email: 'priya.sharma@student.kmbbcet.edu',
      role: 'student'
    },
    include: {
      student: true
    }
  })

  if (studentPriya) {
    console.log('Found student with conflicting email:')
    console.log(`Name: ${studentPriya.name}`)
    console.log(`Email: ${studentPriya.email}`)
    console.log(`Roll No: ${studentPriya.student?.rollNo}`)
    
    // Update to use roll number in email
    const newEmail = `priya.sharma.${studentPriya.student?.rollNo.toLowerCase()}@kmbb.in`
    
    await prisma.user.update({
      where: { id: studentPriya.id },
      data: { email: newEmail }
    })
    
    console.log(`\n✅ Updated student email to: ${newEmail}`)
  } else {
    console.log('No conflicts found!')
  }

  // Show all Priya users
  console.log('\n📋 All users named Priya:')
  const priyaUsers = await prisma.user.findMany({
    where: {
      name: { contains: 'Priya' }
    },
    include: {
      student: true,
      teacher: true
    }
  })

  priyaUsers.forEach(user => {
    console.log(`- ${user.name} (${user.role}): ${user.email}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
