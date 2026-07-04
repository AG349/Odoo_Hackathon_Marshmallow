const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pre-authorized emails...');

  const preAuthData = [
    { email: 'admin@hrms.local', employeeId: 'EMP-001', role: 'HR' },
    { email: 'employee@hrms.local', employeeId: 'EMP-002', role: 'EMPLOYEE' },
    { email: 'john.doe@hrms.local', employeeId: 'EMP-003', role: 'HR' },
    { email: 'jane.smith@hrms.local', employeeId: 'EMP-004', role: 'EMPLOYEE' }
  ];

  for (const item of preAuthData) {
    await prisma.preAuthorizedEmail.upsert({
      where: { email: item.email },
      update: {
        role: item.role,
        employeeId: item.employeeId
      },
      create: item
    });
  }

  console.log('Pre-authorized emails seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
