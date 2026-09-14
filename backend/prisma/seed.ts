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
  { name: 'Floodlights' },
  { name: 'Covered Turf / Netting' },
  { name: 'Air-Conditioned Changing Rooms' },
  { name: 'Free Car & Bike Parking' },
  { name: 'Cafeteria & Energy Drinks' },
  { name: 'First Aid & Physio Kit' },
  { name: 'Pro Match Bibs & Balls' },
  { name: 'Locker Facility' },
  { name: 'Shower & Restrooms' },
];

const realTurfsData = [
  {
    name: 'Velocity Arena & AstroPitch',
    city: 'Mumbai',
    address: 'Andheri Sports Complex Rd, Lokhandwala, Andheri West, Mumbai',
    description: 'Premier 50mm FIFA-grade artificial AstroTurf pitch designed for 5-a-side football and high-intensity box cricket. Equipped with 800W high-mast LED floodlights, sound surround match speakers, and spectator dugout benches.',
    sports: ['football', 'cricket'],
    facilities: ['Floodlights', 'Covered Turf / Netting', 'Air-Conditioned Changing Rooms', 'Free Car & Bike Parking', 'Pro Match Bibs & Balls'],
    images: [
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
    ],
    startingPrice: 1200,
    peakPrice: 1600,
  },
  {
    name: 'Skyline Box Cricket & Futsal Club',
    city: 'Pune',
    address: 'Baner-Pashan Link Road, Near Symphony IT Park, Pune',
    description: 'High-ceiling fully enclosed net arena with non-abrasive turf shock pads. Perfect for competitive evening cricket tournaments, night futsal sessions, and corporate team sports.',
    sports: ['cricket', 'football'],
    facilities: ['Floodlights', 'Covered Turf / Netting', 'Cafeteria & Energy Drinks', 'Free Car & Bike Parking'],
    images: [
      'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'
    ],
    startingPrice: 900,
    peakPrice: 1300,
  },
  {
    name: 'The Arena Pro Turf & Badminton Dome',
    city: 'Bangalore',
    address: 'Sarjapur Main Road, Bellandur, Bengaluru',
    description: 'Multi-sport sports hub featuring BWF certified synthetic rubber badminton courts alongside a 7-a-side floodlit football field. Fully equipped with modern shower amenities and sports drinks bar.',
    sports: ['football', 'badminton', 'volleyball'],
    facilities: ['Floodlights', 'Air-Conditioned Changing Rooms', 'Locker Facility', 'Shower & Restrooms', 'Pro Match Bibs & Balls'],
    images: [
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80'
    ],
    startingPrice: 1100,
    peakPrice: 1500,
  },
  {
    name: 'Legends Turf & Clay Tennis Grounds',
    city: 'Hyderabad',
    address: 'Road No. 45, Jubilee Hills, Hyderabad',
    description: 'State-of-the-art sports complex offering international standard red clay tennis courts and all-weather synthetic turf. Home to local weekend leagues and night floodlit exhibition matches.',
    sports: ['tennis', 'football', 'cricket'],
    facilities: ['Floodlights', 'Free Car & Bike Parking', 'Cafeteria & Energy Drinks', 'First Aid & Physio Kit'],
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'
    ],
    startingPrice: 1400,
    peakPrice: 1800,
  },
  {
    name: 'Apex Sports Park & Hoops Complex',
    city: 'Delhi',
    address: 'Near Siri Fort Sports Complex, August Kranti Marg, New Delhi',
    description: 'All-inclusive multi-sport venue with full-court FIBA acrylic basketball court, premium volleyball setup, and high-tensile caged box cricket pitch.',
    sports: ['basketball', 'volleyball', 'cricket'],
    facilities: ['Floodlights', 'Locker Facility', 'Shower & Restrooms', 'First Aid & Physio Kit'],
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80'
    ],
    startingPrice: 800,
    peakPrice: 1200,
  },
  {
    name: 'Camp Nou Arena & Kickoff Zone',
    city: 'Mumbai',
    address: 'Bandra Reclamation, Bandra West, Mumbai',
    description: 'Sea-breeze turf featuring panoramic views and top-tier all-weather synthetic grass. The favorite pitch for Mumbai football enthusiasts and night tournaments.',
    sports: ['football'],
    facilities: ['Floodlights', 'Free Car & Bike Parking', 'Pro Match Bibs & Balls', 'Cafeteria & Energy Drinks'],
    images: [
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
    ],
    startingPrice: 1500,
    peakPrice: 2000,
  }
];

// Sample real player reviews
const sampleReviews = [
  { rating: 5, comment: 'Phenomenal turf quality! The ball bounce is consistent and floodlights provide zero blind spots during night games.' },
  { rating: 5, comment: 'Clean changing rooms, ample parking, and very responsive staff. Our squad booked the 8 PM slot and had a blast!' },
  { rating: 4, comment: 'Great pitch grip and non-slip rubber infill. Best box cricket experience in town. Will definitely book again.' },
];

async function main() {
  console.log('🌱 Seeding authentic sports and facilities...');
  for (const sport of sports) {
    await prisma.sport.upsert({ where: { slug: sport.slug }, update: {}, create: sport });
  }

  const facilityMap: Record<string, number> = {};
  for (const facility of facilities) {
    const f = await prisma.facility.upsert({
      where: { name: facility.name },
      update: {},
      create: facility,
    });
    facilityMap[facility.name] = f.id;
  }

  const sportsList = await prisma.sport.findMany();
  const sportMap: Record<string, number> = {};
  sportsList.forEach((s) => {
    sportMap[s.slug] = s.id;
  });

  // Create or verify Admin
  const adminEmail = 'admin@buffturf.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: { name: 'Admin Master', email: adminEmail, passwordHash, role: 'ADMIN' },
    });
    console.log('✅ Admin user ready: admin@buffturf.com / admin123');
  }

  // Create or verify Arena Owner
  const ownerEmail = 'owner@buffturf.com';
  let owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (!owner) {
    const passwordHash = await bcrypt.hash('owner123', 12);
    owner = await prisma.user.create({
      data: {
        name: 'Kabir Arena Partners',
        email: ownerEmail,
        passwordHash,
        role: 'TURF_OWNER',
        phone: '+91 98200 12345',
      },
    });
    console.log('✅ Turf Owner ready: owner@buffturf.com / owner123');
  }

  // Create a verified player for reviews & booking demonstrations
  const playerEmail = 'player@buffturf.com';
  let player = await prisma.user.findUnique({ where: { email: playerEmail } });
  if (!player) {
    const passwordHash = await bcrypt.hash('player123', 12);
    player = await prisma.user.create({
      data: {
        name: 'Arjun Sharma',
        email: playerEmail,
        passwordHash,
        role: 'USER',
        phone: '+91 98111 88888',
      },
    });
    console.log('✅ Demo player ready: player@buffturf.com / player123');
  }

  console.log('🏟️ Seeding authentic live turfs with photo galleries and scheduling...');
  for (const t of realTurfsData) {
    // Check if turf already exists by name
    let turf = await prisma.turf.findFirst({ where: { name: t.name } });

    if (!turf) {
      turf = await prisma.turf.create({
        data: {
          ownerId: owner.id,
          name: t.name,
          city: t.city,
          address: t.address,
          description: t.description,
          status: 'APPROVED',
          images: {
            create: t.images.map((url, idx) => ({ url, isPrimary: idx === 0 })),
          },
          turfSports: {
            create: t.sports.map((slug) => ({ sportId: sportMap[slug] })),
          },
          facilities: {
            create: t.facilities.map((name) => ({ facilityId: facilityMap[name] })),
          },
        },
      });

      // Generate time slots across all 7 days of week (0 to 6)
      const hours = [
        { start: '06:00', end: '07:00', isPeak: false },
        { start: '07:00', end: '08:00', isPeak: false },
        { start: '08:00', end: '09:00', isPeak: false },
        { start: '09:00', end: '10:00', isPeak: false },
        { start: '16:00', end: '17:00', isPeak: false },
        { start: '17:00', end: '18:00', isPeak: true },
        { start: '18:00', end: '19:00', isPeak: true },
        { start: '19:00', end: '20:00', isPeak: true },
        { start: '20:00', end: '21:00', isPeak: true },
        { start: '21:00', end: '22:00', isPeak: true },
        { start: '22:00', end: '23:00', isPeak: true },
      ];

      for (let day = 0; day <= 6; day++) {
        for (const slot of hours) {
          await prisma.timeSlot.create({
            data: {
              turfId: turf.id,
              dayOfWeek: day,
              startTime: slot.start,
              endTime: slot.end,
              price: slot.isPeak ? t.peakPrice : t.startingPrice,
              isActive: true,
            },
          });
        }
      }

      // Add a verified past completed booking & review from player
      const primarySportId = sportMap[t.sports[0]];
      const pastSlot = await prisma.timeSlot.findFirst({
        where: { turfId: turf.id, dayOfWeek: 1, startTime: '19:00' },
      });

      if (pastSlot) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 2);

        const demoBooking = await prisma.booking.create({
          data: {
            userId: player.id,
            turfId: turf.id,
            timeSlotId: pastSlot.id,
            sportId: primarySportId,
            bookingDate: pastDate,
            status: 'COMPLETED',
            totalPrice: pastSlot.price,
            activeKey: null,
            payment: {
              create: {
                amount: pastSlot.price,
                method: 'CARD_PAYMENT',
                status: 'SUCCESS',
                transactionRef: `BT-TXN-${Date.now()}-${turf.id}`,
              },
            },
          },
        });

        const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        await prisma.review.create({
          data: {
            userId: player.id,
            turfId: turf.id,
            bookingId: demoBooking.id,
            rating: randomReview.rating,
            comment: randomReview.comment,
          },
        });
      }

      console.log(`✅ Real Arena created: ${t.name} (${t.city}) with 77 live time slots & verified review.`);
    }
  }

  console.log('🎉 Database successfully populated with realistic sports arenas, real photos, verified ratings, and schedules!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());