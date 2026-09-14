import { useEffect, useState } from 'react';
import { getAllTurfs, updateTurfStatus, type AdminTurf } from '../../services/api/admin';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const statusBadgeVariant: Record<AdminTurf['status'], 'amber' | 'emerald' | 'red'> = {
  PENDING: 'amber',
  APPROVED: 'emerald',
  REJECTED: 'red',
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

  if (!turfs) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="mt-3 font-mono text-xs text-amber-400">Loading arena submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-amber-500/10 pb-4">
        <Badge variant="amber">Arena Auditing</Badge>
        <h1 className="mt-2 font-display text-3xl font-black uppercase text-white">
          Turf Listings ({turfs.length})
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Verify safety, surface specs, and owner legitimacy before approving new grounds.
        </p>
      </div>

      <div className="space-y-3">
        {turfs.map((turf) => (
          <Card key={turf.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold uppercase text-white">{turf.name}</h3>
                  <Badge variant={statusBadgeVariant[turf.status]}>
                    {turf.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  📍 {turf.city} · Listed by <strong className="text-white">{turf.owner.name}</strong> ({turf.owner.email})
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {turf.turfSports.map((ts) => (
                    <span
                      key={ts.sport.name}
                      className="rounded-md border border-emerald-500/20 bg-[#121E18] px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400"
                    >
                      {ts.sport.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {turf.status === 'PENDING' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatus(turf.id, 'APPROVED')}
                      disabled={updatingId === turf.id}
                    >
                      {updatingId === turf.id ? 'Processing...' : 'Approve Arena ✓'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatus(turf.id, 'REJECTED')}
                      disabled={updatingId === turf.id}
                    >
                      Reject Listing ✕
                    </Button>
                  </>
                )}
                {turf.status === 'APPROVED' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatus(turf.id, 'REJECTED')}
                    disabled={updatingId === turf.id}
                  >
                    Suspend Turf
                  </Button>
                )}
                {turf.status === 'REJECTED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatus(turf.id, 'APPROVED')}
                    disabled={updatingId === turf.id}
                  >
                    Re-Approve Turf
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}