import { useEffect, useState } from 'react';
import { getAdminComplaints, updateComplaintStatus, type Complaint } from '../../services/api/complaint';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    try {
      setLoading(true);
      const data = await getAdminComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to fetch admin complaints:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: number, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') {
    try {
      setUpdatingId(id);
      const updated = await updateComplaintStatus(id, status);
      setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Failed to update complaint status:', err);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredComplaints = filterStatus === 'ALL'
    ? complaints
    : complaints.filter((c) => c.status === filterStatus);

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Resolved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Open
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Platform Complaints</h1>
          <p className="text-sm text-ink-900/60">Review and update customer complaints and support tickets</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink-900/60">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-ink-900/20 bg-white px-3 py-1.5 text-xs font-medium text-ink-900 focus:outline-none"
          >
            <option value="ALL">All Complaints ({complaints.length})</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-ink-900/50">Loading complaints...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-900/20 p-8 text-center text-sm text-ink-900/50 bg-chalk-50">
          No complaints found for the selected status.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((c) => (
            <div key={c.id} className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-ink-900/5 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-ink-900/40">#{c.id}</span>
                    <h3 className="font-semibold text-ink-900 text-base">{c.subject}</h3>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-900/60">
                    <span>User: <strong>{c.user?.name}</strong> ({c.user?.email})</span>
                    {c.turf && <span>Turf: <strong className="text-turf-700">{c.turf.name}</strong></span>}
                    <span>Date: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start mt-2 sm:mt-0">
                  {getStatusBadge(c.status)}
                  <select
                    value={c.status}
                    disabled={updatingId === c.id}
                    onChange={(e) =>
                      handleStatusChange(c.id, e.target.value as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED')
                    }
                    className="rounded-md border border-ink-900/20 bg-chalk-50 px-2 py-1 text-xs font-semibold text-ink-900 focus:outline-none cursor-pointer"
                  >
                    <option value="OPEN">Mark Open</option>
                    <option value="IN_PROGRESS">Mark In Progress</option>
                    <option value="RESOLVED">Mark Resolved</option>
                  </select>
                </div>
              </div>

              <p className="text-sm text-ink-900/80 leading-relaxed whitespace-pre-wrap">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
