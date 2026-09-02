import { useEffect, useState } from 'react';
import { getAdminAnalytics, downloadBookingsCSV, type AdminAnalyticsData } from '../../services/api/analytics';
import Button from '../../components/ui/Button';

export default function AdminAnalytics() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      const res = await getAdminAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch admin analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCSV() {
    try {
      setDownloading(true);
      await downloadBookingsCSV();
    } catch (err) {
      console.error('Failed to download CSV report:', err);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-sm text-ink-900/50">Loading platform analytics...</div>;
  }

  if (!data) {
    return <div className="py-12 text-center text-sm text-ink-900/50">Failed to load platform analytics.</div>;
  }

  const maxMonthlyRevenue = Math.max(...data.monthlyRevenue.map((m) => m.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-900/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Platform Analytics & Global Reports</h1>
          <p className="text-sm text-ink-900/60">Cross-platform revenue velocity, registration volume, and top venue metrics</p>
        </div>
        <Button onClick={handleExportCSV} disabled={downloading} variant="primary" className="gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {downloading ? 'Downloading...' : 'Export Master CSV'}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Total Gross Revenue</p>
          <p className="mt-2 font-display text-3xl font-bold text-turf-700">₹{data.totalRevenue.toLocaleString()}</p>
          <span className="mt-1 block text-xs text-emerald-600 font-medium">Platform transaction total</span>
        </div>

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Registered Users</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900">{data.totalUsers}</p>
          <span className="mt-1 block text-xs text-ink-900/50">Users & Owners</span>
        </div>

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Platform Turfs</p>
          <p className="mt-2 font-display text-3xl font-bold text-pitch-500">{data.totalTurfs}</p>
          <span className="mt-1 block text-xs text-ink-900/50">Listings in database</span>
        </div>

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Confirmed Bookings</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900">{data.totalBookings}</p>
          <span className="mt-1 block text-xs text-ink-900/50">Total completed transactions</span>
        </div>
      </div>

      {/* Revenue Velocity Chart */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-ink-900 text-lg mb-1">Platform Revenue Velocity</h2>
          <p className="text-xs text-ink-900/50 mb-6">Gross platform transactions over past 6 months</p>

          <div className="flex h-56 items-end gap-3 pt-6 border-b border-ink-900/10 pb-2">
            {data.monthlyRevenue.map((m) => {
              const heightPercent = Math.round((m.revenue / maxMonthlyRevenue) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-semibold text-ink-900/60">₹{m.revenue}</span>
                  <div
                    className="w-full rounded-t-md bg-pitch-500 hover:bg-pitch-600 transition-all duration-300 min-h-[4px]"
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                    title={`${m.month}: ₹${m.revenue}`}
                  />
                  <span className="text-xs font-medium text-ink-900/60 mt-1">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Venues */}
        <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-ink-900 text-lg mb-1">Top Performing Sports Turfs</h2>
          <p className="text-xs text-ink-900/50 mb-4">Highest booking volume venues</p>

          {data.topTurfs.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-900/40">No turf booking activity yet</div>
          ) : (
            <div className="space-y-3">
              {data.topTurfs.map((t, idx) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border border-ink-900/5 bg-chalk-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-turf-700 text-xs font-bold text-white">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink-900 text-sm">{t.name}</h3>
                      <span className="text-xs text-ink-900/50">{t.city}</span>
                    </div>
                  </div>
                  <span className="rounded-md bg-pitch-100 px-3 py-1 text-xs font-bold text-pitch-700">
                    {t.bookingsCount} bookings
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
