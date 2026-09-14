import { useEffect, useState } from 'react';
import { getDashboardStats, type DashboardStats } from '../../services/api/ownerDashboard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function OwnerOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-3 font-mono text-xs text-emerald-400">Loading arena metrics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-emerald-500/10 pb-4">
        <Badge variant="emerald">Live Arena Telemetry</Badge>
        <h1 className="mt-2 font-display text-3xl font-black uppercase text-white">
          Arena Operations Overview
        </h1>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bookings</p>
          <p className="mt-2 font-display text-4xl font-black text-white">{stats.totalBookings}</p>
          <span className="mt-1 block text-[11px] text-slate-500">Lifetime volume</span>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Matches</p>
          <p className="mt-2 font-display text-4xl font-black text-emerald-400">{stats.todayBookings}</p>
          <span className="mt-1 block text-[11px] text-emerald-500/80">Active match day</span>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</p>
          <p className="mt-2 font-mono text-3xl font-black text-emerald-400">₹{stats.totalRevenue}</p>
          <span className="mt-1 block text-[11px] text-slate-500">Processed payout sum</span>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold uppercase text-white">Popular Sports</h2>
          {stats.popularSports.length === 0 ? (
            <p className="mt-3 text-xs text-slate-500">No booking telemetry registered yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {stats.popularSports.map((s) => (
                <div key={s.sport} className="flex items-center justify-between border-b border-emerald-500/5 pb-2 text-xs">
                  <span className="font-semibold text-white">⚽ {s.sport}</span>
                  <span className="font-mono font-bold text-emerald-400">{s.count} sessions</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-bold uppercase text-white">Recent Match Bookings</h2>
          {stats.recentBookings.length === 0 ? (
            <p className="mt-3 text-xs text-slate-500">No recent bookings recorded.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {stats.recentBookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-emerald-500/10 bg-[#121E18] p-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{b.turf.name}</span>
                    <span className="font-mono font-bold text-emerald-400">₹{b.totalPrice}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
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