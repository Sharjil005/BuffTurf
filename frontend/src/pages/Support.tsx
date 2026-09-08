import { useEffect, useState, type FormEvent } from 'react';
import { getMyComplaints, createComplaint, type Complaint } from '../services/api/complaint';
import { getTurfs, type DiscoveryTurf } from '../services/api/turf';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export default function Support() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [turfs, setTurfs] = useState<DiscoveryTurf[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTurfId, setSelectedTurfId] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [complaintData, turfRes] = await Promise.all([
        getMyComplaints(),
        getTurfs(),
      ]);
      setComplaints(complaintData);
      setTurfs(turfRes.turfs);
    } catch (err: any) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!subject.trim() || subject.length < 3) {
      setFeedback({ type: 'error', message: 'Subject must be at least 3 characters long.' });
      return;
    }
    if (!description.trim() || description.length < 10) {
      setFeedback({ type: 'error', message: 'Description must be at least 10 characters long.' });
      return;
    }

    try {
      setSubmitting(true);
      const newComplaint = await createComplaint({
        subject: subject.trim(),
        description: description.trim(),
        turfId: selectedTurfId ? Number(selectedTurfId) : undefined,
      });

      setComplaints([newComplaint, ...complaints]);
      setSubject('');
      setDescription('');
      setSelectedTurfId('');
      setFeedback({ type: 'success', message: 'Support ticket registered. Our arena operations team is on it.' });
      setActiveTab('history');
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit complaint. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'RESOLVED':
        return <Badge variant="emerald">Resolved</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="blue">Investigating</Badge>;
      default:
        return <Badge variant="amber">Open</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="border-b border-emerald-500/10 pb-6">
        <Badge variant="amber">Support Desk</Badge>
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-white">
          Player & Arena Support Center
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Have an inquiry, booking dispute, or turf facility feedback? File a ticket below.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-emerald-500/10 pb-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'create'
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          Submit Ticket
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'history'
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <span>My Tickets</span>
          {complaints.length > 0 && (
            <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-emerald-300">
              {complaints.length}
            </span>
          )}
        </button>
      </div>

      {feedback && (
        <div
          className={`mt-6 rounded-2xl p-4 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'create' ? (
        <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-[#0E1713]/90 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
          <h2 className="font-display text-xl font-bold uppercase text-white mb-4">
            Report Issue or Facility Dispute
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                Related Turf Arena (Optional)
              </label>
              <select
                value={selectedTurfId}
                onChange={(e) => setSelectedTurfId(e.target.value)}
                className="rounded-xl border border-emerald-500/20 bg-[#0C1410] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:bg-[#111C17]"
              >
                <option value="">General Platform Issue / Other</option>
                {turfs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Subject / Topic"
              placeholder="e.g. Floodlight failure during night session"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                Detailed Incident Description
              </label>
              <textarea
                rows={5}
                placeholder="Include date, slot time, pitch condition, or any relevant details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl border border-emerald-500/20 bg-[#0C1410] p-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-400 focus:bg-[#111C17]"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Submitting...' : 'Register Support Ticket ⚡'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
              <p className="mt-3 font-mono text-xs text-emerald-400">Loading support tickets...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-500/20 bg-[#0C1410] p-16 text-center">
              <span className="text-4xl">🛡️</span>
              <h3 className="mt-4 font-display text-xl font-bold uppercase text-white">No Tickets Filed</h3>
              <p className="mt-1 text-xs text-slate-400">
                You currently have no active or historical support disputes.
              </p>
            </div>
          ) : (
            complaints.map((c) => (
              <Card key={c.id} className="space-y-3 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase text-white">{c.subject}</h3>
                    {c.turf && (
                      <span className="text-xs font-semibold text-emerald-400">Venue: {c.turf.name}</span>
                    )}
                  </div>
                  {getStatusBadge(c.status)}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {c.description}
                </p>

                <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>TICKET #{c.id}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
