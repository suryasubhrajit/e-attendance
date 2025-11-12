const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  const oldEmails = users.filter(u => u.email.includes('kmbbcet.edu'))
  
  console.log('📊 Email Verification Report\n')
  console.log(`Total users: ${users.length}`)
  console.log(`Old emails remaining: ${oldEmails.length}`)
  
  if (oldEmails.length > 0) {
    console.log('\n❌ Users still with old emails:')
    oldEmails.forEach(u => console.log(`  - ${u.name} (${u.role}): ${u.email}`))
  } else {
    console.log('\n✅ All emails successfully migrated to @kmbb.in!')
    console.log('\n📋 Sample emails:')
    users.slice(0, 5).forEach(u => console.log(`  - ${u.name} (${u.role}): ${u.email}`))
  }
}

main()
  .finally(() => prisma.$disconnect())
