import { useEffect, useState } from 'react';
import { getOwnerAnalytics, downloadBookingsCSV, type OwnerAnalyticsData } from '../../services/api/analytics';
import Button from '../../components/ui/Button';

export default function OwnerAnalytics() {
  const [data, setData] = useState<OwnerAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      const res = await getOwnerAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch owner analytics:', err);
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
    return <div className="py-12 text-center text-sm text-ink-900/50">Loading analytics insights...</div>;
  }

  if (!data) {
    return <div className="py-12 text-center text-sm text-ink-900/50">Failed to load analytics.</div>;
  }

  const maxMonthlyRevenue = Math.max(...data.monthlyRevenue.map((m) => m.revenue), 1);
  const maxPeakCount = Math.max(...data.peakHours.map((p) => p.count), 1);

  return (
    <div className="space-y-8">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-900/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Analytics & Performance Reports</h1>
          <p className="text-sm text-ink-900/60">Comprehensive metrics, occupancy, revenue velocity, and peak slot insights</p>
        </div>
        <Button onClick={handleExportCSV} disabled={downloading} variant="primary" className="gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {downloading ? 'Downloading...' : 'Export Bookings (CSV)'}
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Total Revenue</p>
          <p className="mt-2 font-display text-3xl font-bold text-turf-700">₹{data.totalRevenue.toLocaleString()}</p>
          <span className="mt-1 block text-xs text-emerald-600 font-medium">All time verified earnings</span>
        </div>

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Total Bookings</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900">{data.totalBookings}</p>
          <span className="mt-1 block text-xs text-ink-900/50">Confirmed & Completed</span>
        </div>

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Occupancy Rate</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-display text-3xl font-bold text-pitch-500">{data.occupancyRate}%</p>
            <span className="text-xs text-ink-900/50">past 30 days</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-chalk-200 overflow-hidden">
            <div
              className="h-full bg-pitch-500 transition-all duration-500"
              style={{ width: `${Math.min(100, data.occupancyRate)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">Active Turfs</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900">{data.totalTurfs}</p>
          <span className="mt-1 block text-xs text-ink-900/50">Owned & Managed</span>
        </div>
      </div>

      {/* Visual Revenue Trend & Peak Hours */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Bar Chart */}
        <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-ink-900 text-lg mb-1">Monthly Revenue Trend</h2>
          <p className="text-xs text-ink-900/50 mb-6">Revenue velocity over the last 6 months</p>

          <div className="flex h-56 items-end gap-3 pt-6 border-b border-ink-900/10 pb-2">
            {data.monthlyRevenue.map((m) => {
              const heightPercent = Math.round((m.revenue / maxMonthlyRevenue) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-semibold text-ink-900/60">₹{m.revenue}</span>
                  <div
                    className="w-full rounded-t-md bg-turf-600 hover:bg-turf-700 transition-all duration-300 min-h-[4px]"
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                    title={`${m.month}: ₹${m.revenue}`}
                  />
                  <span className="text-xs font-medium text-ink-900/60 mt-1">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Slot Hours */}
        <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-ink-900 text-lg mb-1">Peak Slot Hours</h2>
          <p className="text-xs text-ink-900/50 mb-6">Most popular booking time slots</p>

          {data.peakHours.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-900/40">No booking data available yet</div>
          ) : (
            <div className="space-y-4">
              {data.peakHours.map((p) => {
                const widthPercent = Math.round((p.count / maxPeakCount) * 100);
                return (
                  <div key={p.time} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-ink-900">
                      <span>{p.time} Slot</span>
                      <span>{p.count} bookings</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-chalk-100 overflow-hidden">
                      <div
                        className="h-full bg-pitch-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, widthPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sport Distribution */}
      {data.sportDistribution.length > 0 && (
        <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-ink-900 text-lg mb-3">Popularity by Sport</h2>
          <div className="flex flex-wrap gap-3">
            {data.sportDistribution.map((s) => (
              <div
                key={s.sport}
                className="flex items-center gap-2 rounded-xl bg-chalk-100 px-4 py-2 text-sm font-semibold text-ink-900 border border-ink-900/5"
              >
                <span>{s.sport}</span>
                <span className="rounded-full bg-turf-700 px-2 py-0.5 text-xs text-white">
                  {s.count} bookings
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
