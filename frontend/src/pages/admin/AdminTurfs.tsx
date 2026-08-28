import { useEffect, useState } from 'react';
import { getAllTurfs, updateTurfStatus, type AdminTurf } from '../../services/api/admin';

const statusStyles = {
  PENDING: 'bg-amber-500/10 text-amber-600',
  APPROVED: 'bg-pitch-500/10 text-pitch-500',
  REJECTED: 'bg-red-500/10 text-red-500',
};

export default function AdminTurfs() {
  const [turfs, setTurfs] = useState<AdminTurf[] | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    getAllTurfs().then(setTurfs);
  }, []);

  async function handleStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    setUpdatingId(id);
    try {
      const updated = await updateTurfStatus(id, status);
      setTurfs((prev) => prev?.map((t) => (t.id === id ? { ...t, status: updated.status } : t)) ?? null);
    } finally {
      setUpdatingId(null);
    }
  }

  if (!turfs) return <p className="text-ink-900/60">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-ink-900">Turfs</h1>
      <div className="mt-6 space-y-3">
        {turfs.map((turf) => (
          <div key={turf.id} className="flex items-center justify-between rounded-lg border border-ink-900/10 bg-chalk-50 px-5 py-4">
            <div>
              <h3 className="font-semibold text-ink-900">{turf.name}</h3>
              <p className="mt-0.5 text-sm text-ink-900/60">
                {turf.city} · {turf.owner.name} ({turf.owner.email})
              </p>
              <p className="mt-0.5 text-sm text-ink-900/50">
                {turf.turfSports.map((ts) => ts.sport.name).join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[turf.status]}`}>
                {turf.status}
              </span>
              {turf.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleStatus(turf.id, 'APPROVED')}
                    disabled={updatingId === turf.id}
                    className="rounded-md bg-pitch-500 px-3 py-1.5 text-xs font-medium text-chalk-50 hover:bg-turf-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(turf.id, 'REJECTED')}
                    disabled={updatingId === turf.id}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}