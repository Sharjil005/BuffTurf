import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api/auth';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ name, phone });
      setMessage('Profile credentials updated successfully.');
    } catch {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0E1713]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <Badge variant="emerald">Player ID #{user.id}</Badge>
          <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 font-display text-2xl font-black text-black shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-3 font-display text-2xl font-black uppercase text-white">
            {user.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          <span className="mt-2 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Role: {user.role}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          <Input label="Registered Email" value={user.email} disabled className="opacity-50 cursor-not-allowed" />

          {message && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 font-semibold text-center">
              {message}
            </div>
          )}

          <Button type="submit" variant="primary" size="md" disabled={saving} className="mt-2 w-full">
            {saving ? 'Updating...' : 'Save Profile Changes ⚡'}
          </Button>
        </form>
      </div>
    </div>
  );
}