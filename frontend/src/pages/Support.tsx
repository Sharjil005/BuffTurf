import { useEffect, useState, type FormEvent } from 'react';
import { getMyComplaints, createComplaint, type Complaint } from '../services/api/complaint';
import { getTurfs, type DiscoveryTurf } from '../services/api/turf';
import Button from '../components/ui/Button';

export default function Support() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [turfs, setTurfs] = useState<DiscoveryTurf[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  // Form fields
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
      console.error('Failed to load support data:', err);
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
      setFeedback({ type: 'success', message: 'Support ticket submitted successfully! Our team will review it.' });
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">
          Help & Support Center
        </h1>
        <p className="mt-1 text-sm text-ink-900/60">
          Have an issue with a booking, payment, or turf facility? Submit a ticket and track its resolution.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-ink-900/10">
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-turf-700 text-turf-700'
              : 'border-transparent text-ink-900/50 hover:text-ink-900'
          }`}
        >
          Submit Support Ticket
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-turf-700 text-turf-700'
              : 'border-transparent text-ink-900/50 hover:text-ink-900'
          }`}
        >
          My Tickets
          {complaints.length > 0 && (
            <span className="rounded-full bg-turf-100 px-2 py-0.5 text-xs text-turf-800">
              {complaints.length}
            </span>
          )}
        </button>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-lg p-4 text-sm font-medium ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'create' ? (
        <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">File a Ticket / Report an Issue</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">
                Related Turf (Optional)
              </label>
              <select
                value={selectedTurfId}
                onChange={(e) => setSelectedTurfId(e.target.value)}
                className="w-full rounded-lg border border-ink-900/20 bg-white px-3 py-2 text-sm focus:border-turf-700 focus:outline-none"
              >
                <option value="">General Platform Issue / Other</option>
                {turfs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g. Issue with lighting during evening slot"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-ink-900/20 bg-white px-3 py-2 text-sm focus:border-turf-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">
                Detailed Description
              </label>
              <textarea
                rows={5}
                placeholder="Please describe what happened, including dates or booking reference numbers if applicable..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-ink-900/20 bg-white p-3 text-sm focus:border-turf-700 focus:outline-none"
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Submitting...' : 'Submit Support Ticket'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-ink-900/50">Loading tickets...</div>
          ) : complaints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-900/20 p-8 text-center text-sm text-ink-900/50 bg-chalk-50">
              You have not submitted any support tickets yet.
            </div>
          ) : (
            complaints.map((c) => (
              <div key={c.id} className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-ink-900">{c.subject}</h3>
                    {c.turf && (
                      <span className="text-xs font-medium text-turf-700">Turf: {c.turf.name}</span>
                    )}
                  </div>
                  {getStatusBadge(c.status)}
                </div>

                <p className="text-sm text-ink-900/80 leading-relaxed whitespace-pre-wrap">{c.description}</p>

                <div className="pt-2 border-t border-ink-900/5 flex items-center justify-between text-xs text-ink-900/40">
                  <span>Ticket #{c.id}</span>
                  <span>Submitted on {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
