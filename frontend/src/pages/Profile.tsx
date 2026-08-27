import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api/auth';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

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
      setMessage('Profile updated successfully.');
    } catch {
      setMessage('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="font-display text-3xl uppercase text-ink-900">My Profile</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="Email" value={user.email} disabled className="opacity-60" />
        {message && <p className="text-sm text-pitch-500">{message}</p>}
        <Button type="submit" variant="primary" disabled={saving} className="mt-2">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}