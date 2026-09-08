import { useEffect, useState } from 'react';
import { getPlatformStats, type PlatformStats } from '../../services/api/admin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AdminOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    getPlatformStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="mt-3 font-mono text-xs text-amber-400">Loading platform command telemetry...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-amber-500/10 pb-4">
        <Badge variant="amber">Master Ops Command</Badge>
        <h1 className="mt-2 font-display text-3xl font-black uppercase text-white">
          Platform System Overview
        </h1>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
          <p className="mt-2 font-display text-4xl font-black text-white">{stats.totalUsers}</p>
          <span className="mt-1 block text-[11px] text-slate-500">Registered athletes & owners</span>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Listed Arenas</p>
          <p className="mt-2 font-display text-4xl font-black text-white">{stats.totalTurfs}</p>
          <span className="mt-1 block text-[11px] text-slate-500">Total turf inventory</span>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Approvals</p>
          <p className="mt-2 font-display text-4xl font-black text-amber-400">{stats.pendingTurfs}</p>
          <span className="mt-1 block text-[11px] text-amber-500/80">Requires verification</span>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Bookings</p>
          <p className="mt-2 font-display text-4xl font-black text-emerald-400">{stats.totalBookings}</p>
          <span className="mt-1 block text-[11px] text-emerald-500/80">Completed & active matches</span>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform GMV Revenue</p>
          <p className="mt-2 font-mono text-3xl font-black text-emerald-400">₹{stats.totalRevenue}</p>
          <span className="mt-1 block text-[11px] text-slate-500">Gross platform turnover</span>
        </Card>
      </div>
    </div>
  );
}