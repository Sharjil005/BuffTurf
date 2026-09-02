import { prisma } from '../config/db';

export async function getOwnerAnalytics(ownerId: number) {
  const turfs = await prisma.turf.findMany({
    where: { ownerId },
    select: { id: true, name: true },
  });
  const turfIds = turfs.map((t) => t.id);

  if (turfIds.length === 0) {
    return {
      totalTurfs: 0,
      totalBookings: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      monthlyRevenue: [],
      peakHours: [],
      sportDistribution: [],
    };
  }

  const [totalBookings, totalSlotsCount, payments, bookingsWithSlot] = await Promise.all([
    prisma.booking.count({ where: { turfId: { in: turfIds }, status: { not: 'CANCELLED' } } }),
    prisma.timeSlot.count({ where: { turfId: { in: turfIds }, isActive: true } }),
    prisma.payment.findMany({
      where: { booking: { turfId: { in: turfIds } }, status: 'SUCCESS' },
      select: { amount: true, createdAt: true },
    }),
    prisma.booking.findMany({
      where: { turfId: { in: turfIds }, status: { not: 'CANCELLED' } },
      include: { timeSlot: true, sport: true },
    }),
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Occupancy Rate: Bookings in past 30 days vs (Slots * 30)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentBookingsCount = bookingsWithSlot.filter((b) => new Date(b.bookingDate) >= thirtyDaysAgo).length;
  const maxPossibleBookings = totalSlotsCount * 30;
  const occupancyRate = maxPossibleBookings > 0 ? Math.round((recentBookingsCount / maxPossibleBookings) * 100) : 0;

  // Monthly Revenue breakdown (Last 6 months)
  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    monthlyMap.set(monthKey, 0);
  }

  payments.forEach((p) => {
    const monthKey = new Date(p.createdAt).toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + Number(p.amount));
    }
  });

  const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue }));

  // Peak Slot Hours
  const hourMap = new Map<string, number>();
  bookingsWithSlot.forEach((b) => {
    if (b.timeSlot) {
      const time = b.timeSlot.startTime;
      hourMap.set(time, (hourMap.get(time) || 0) + 1);
    }
  });
  const peakHours = Array.from(hourMap.entries())
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Sport distribution
  const sportMap = new Map<string, number>();
  bookingsWithSlot.forEach((b) => {
    if (b.sport) {
      sportMap.set(b.sport.name, (sportMap.get(b.sport.name) || 0) + 1);
    }
  });
  const sportDistribution = Array.from(sportMap.entries())
    .map(([sport, count]) => ({ sport, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalTurfs: turfs.length,
    totalBookings,
    totalRevenue,
    occupancyRate,
    monthlyRevenue,
    peakHours,
    sportDistribution,
  };
}

export async function getAdminAnalytics() {
  const [totalUsers, totalTurfs, totalBookings, payments, topTurfsRaw] = await Promise.all([
    prisma.user.count(),
    prisma.turf.count(),
    prisma.booking.count({ where: { status: { not: 'CANCELLED' } } }),
    prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true, createdAt: true },
    }),
    prisma.turf.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        city: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { bookings: { _count: 'desc' } },
    }),
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Monthly Revenue breakdown (Last 6 months)
  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    monthlyMap.set(monthKey, 0);
  }

  payments.forEach((p) => {
    const monthKey = new Date(p.createdAt).toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + Number(p.amount));
    }
  });

  const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue }));

  const topTurfs = topTurfsRaw.map((t) => ({
    id: t.id,
    name: t.name,
    city: t.city,
    bookingsCount: t._count.bookings,
  }));

  return {
    totalUsers,
    totalTurfs,
    totalBookings,
    totalRevenue,
    monthlyRevenue,
    topTurfs,
  };
}

// L3: CSV export accepts optional date range and enforces a 10,000 row hard cap.
export async function exportBookingsCSV(
  userId: number,
  role: string,
  startDate?: string,
  endDate?: string
): Promise<string> {
  const CSV_ROW_CAP = 10_000;

  let whereClause: any = {};

  if (role === 'TURF_OWNER') {
    const turfs = await prisma.turf.findMany({ where: { ownerId: userId }, select: { id: true } });
    const turfIds = turfs.map((t) => t.id);
    whereClause = { turfId: { in: turfIds } };
  } else if (role !== 'ADMIN') {
    whereClause = { userId };
  }

  // Optional date range filter on bookingDate
  if (startDate || endDate) {
    whereClause.bookingDate = {};
    if (startDate) whereClause.bookingDate.gte = new Date(`${startDate}T00:00:00Z`);
    if (endDate) whereClause.bookingDate.lte = new Date(`${endDate}T23:59:59Z`);
  }

  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
      turf: { select: { name: true } },
      sport: { select: { name: true } },
      timeSlot: { select: { startTime: true, endTime: true } },
      payment: { select: { status: true, amount: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: CSV_ROW_CAP, // Hard cap — prevents memory exhaustion on large datasets
  });

  const headers = ['Booking ID', 'User Name', 'User Email', 'Turf Name', 'Sport', 'Booking Date', 'Time Slot', 'Price (INR)', 'Status', 'Payment Status'];

  const rows = bookings.map((b) => [
    b.id,
    `"${b.user.name.replace(/"/g, '""')}"`,
    `"${b.user.email.replace(/"/g, '""')}"`,
    `"${b.turf.name.replace(/"/g, '""')}"`,
    `"${b.sport.name.replace(/"/g, '""')}"`,
    new Date(b.bookingDate).toISOString().split('T')[0],
    `"${b.timeSlot ? `${b.timeSlot.startTime} - ${b.timeSlot.endTime}` : 'N/A'}"`,
    Number(b.totalPrice),
    b.status,
    b.payment ? b.payment.status : 'UNPAID',
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
