const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting email migration to @kmbb.in domain...\n')

  try {
    // Get all users with old email domains
    const users = await prisma.user.findMany()
    
    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const user of users) {
      let newEmail = user.email
      
      // Replace @student.kmbbcet.edu with @kmbb.in
      if (user.email.includes('@student.kmbbcet.edu')) {
        newEmail = user.email.replace('@student.kmbbcet.edu', '@kmbb.in')
      }
      // Replace @kmbbcet.edu with @kmbb.in
      else if (user.email.includes('@kmbbcet.edu')) {
        newEmail = user.email.replace('@kmbbcet.edu', '@kmbb.in')
      }
      
      // Update if email changed
      if (newEmail !== user.email) {
        try {
          // Check if new email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: newEmail }
          })
          
          if (existingUser && existingUser.id !== user.id) {
            console.log(`⚠️  Conflict: ${user.email} → ${newEmail} (already exists for ${existingUser.name})`)
            errorCount++
            continue
          }
          
          await prisma.user.update({
            where: { id: user.id },
            data: { email: newEmail }
          })
          console.log(`✅ Updated: ${user.email} → ${newEmail} (${user.role}: ${user.name})`)
          updatedCount++
        } catch (error) {
          console.log(`❌ Error updating ${user.email}: ${error.message}`)
          errorCount++
        }
      } else {
        skippedCount++
      }
    }

    console.log('\n📊 Migration Summary:')
    console.log(`Total users: ${users.length}`)
    console.log(`Updated: ${updatedCount}`)
    console.log(`Skipped: ${skippedCount}`)
    console.log(`Errors/Conflicts: ${errorCount}`)
    console.log('\n🎉 Email migration completed!')
    
    // Show new login credentials
    console.log('\n📋 Updated Login Credentials:')
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
    const teacher = await prisma.user.findFirst({ where: { role: 'teacher' } })
    
    if (admin) console.log(`Admin: ${admin.email} / admin123`)
    if (teacher) console.log(`Teacher: ${teacher.email} / teacher123`)
    console.log('Students: Use their roll number as password (e.g., 2021001234@123)')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
