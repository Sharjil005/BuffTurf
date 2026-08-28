import { useEffect, useState } from 'react';
import { getPlatformStats, type PlatformStats } from '../../services/api/admin';
import Card from '../../components/ui/Card';

export default function AdminOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    getPlatformStats().then(setStats);
  }, []);

  if (!stats) return <p className="text-ink-900/60">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-ink-900">Platform Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-900/50">Total Users</p>
          <p className="mt-1 font-mono text-3xl text-ink-900">{stats.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/50">Total Turfs</p>
          <p className="mt-1 font-mono text-3xl text-ink-900">{stats.totalTurfs}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/50">Pending Approvals</p>
          <p className="mt-1 font-mono text-3xl text-amber-500">{stats.pendingTurfs}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/50">Total Bookings</p>
          <p className="mt-1 font-mono text-3xl text-pitch-500">{stats.totalBookings}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-900/50">Platform Revenue</p>
          <p className="mt-1 font-mono text-3xl text-turf-700">₹{stats.totalRevenue}</p>
        </Card>
      </div>
    </div>
  );
}