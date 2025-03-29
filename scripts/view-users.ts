import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function viewUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
        emailVerificationToken: true,
        emailVerificationExpiry: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\nRegistered Users:');
    console.log('=================');
    users.forEach(user => {
      console.log('\nUser Details:');
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name || 'Not provided'}`);
      console.log(`Verified: ${user.isVerified ? 'Yes' : 'No'}`);
      console.log(`Created At: ${user.createdAt}`);
      console.log(`Verification Token: ${user.emailVerificationToken ? 'Present' : 'None'}`);
      console.log(`Token Expiry: ${user.emailVerificationExpiry || 'None'}`);
      console.log('-----------------');
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewUsers(); 