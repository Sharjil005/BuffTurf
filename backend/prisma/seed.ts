import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const sports = [
  { name: 'Cricket', slug: 'cricket' },
  { name: 'Football', slug: 'football' },
  { name: 'Badminton', slug: 'badminton' },
  { name: 'Basketball', slug: 'basketball' },
  { name: 'Volleyball', slug: 'volleyball' },
  { name: 'Tennis', slug: 'tennis' },
];

const facilities = [
  { name: 'Parking' },
  { name: 'Washroom' },
  { name: 'Floodlights' },
  { name: 'Drinking Water' },
  { name: 'Changing Room' },
  { name: 'First Aid' },
];

async function main() {
  for (const sport of sports) {
    await prisma.sport.upsert({ where: { slug: sport.slug }, update: {}, create: sport });
  }
  for (const facility of facilities) {
    await prisma.facility.upsert({
      where: { name: facility.name },
      update: {},
      create: facility,
    });
  }
  console.log('✅ Seed complete');
  const adminEmail = 'admin@buffturf.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, passwordHash, role: 'ADMIN' },
    });
    console.log('✅ Admin user created: admin@buffturf.com / admin123');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());