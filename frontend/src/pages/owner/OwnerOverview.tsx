import { useEffect, useState } from 'react';
import { getDashboardStats, type DashboardStats } from '../../services/api/ownerDashboard';
import Card from '../../components/ui/Card';

export default function OwnerOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <p className="text-ink-900/60">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-ink-900">Overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-900/50">Total Bookings</p>
          <p className="mt-1 font-mono text-3xl text-ink-900">{stats.totalBookings}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/50">Today's Bookings</p>
          <p className="mt-1 font-mono text-3xl text-pitch-500">{stats.todayBookings}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/50">Total Revenue</p>
          <p className="mt-1 font-mono text-3xl text-turf-700">₹{stats.totalRevenue}</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg uppercase text-ink-900">Popular Sports</h2>
          {stats.popularSports.length === 0 ? (
            <p className="mt-3 text-sm text-ink-900/50">No bookings yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {stats.popularSports.map((s) => (
                <div key={s.sport} className="flex justify-between text-sm">
                  <span className="text-ink-900">{s.sport}</span>
                  <span className="font-mono text-ink-900/60">{s.count} bookings</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-lg uppercase text-ink-900">Recent Bookings</h2>
          {stats.recentBookings.length === 0 ? (
            <p className="mt-3 text-sm text-ink-900/50">No bookings yet.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {stats.recentBookings.map((b) => (
                <div key={b.id} className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-900">{b.turf.name}</span>
                    <span className="font-mono text-turf-700">₹{b.totalPrice}</span>
                  </div>
                  <p className="text-ink-900/50">
                    {b.user.name} · {b.sport.name} · {new Date(b.bookingDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}