import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, type AdminUser } from '../../services/api/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  async function handleRoleChange(id: number, role: string) {
    setUpdatingId(id);
    try {
      await updateUserRole(id, role);
      setUsers((prev) => prev?.map((u) => (u.id === id ? { ...u, role: role as AdminUser['role'] } : u)) ?? null);
    } finally {
      setUpdatingId(null);
    }
  }

  if (!users) return <p className="text-ink-900/60">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-ink-900">Users</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-ink-900/10">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-900/10 bg-ink-900/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-ink-900/60">Name</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Email</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Role</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5">
            {users.map((user) => (
              <tr key={user.id} className="bg-chalk-50">
                <td className="px-4 py-3 text-ink-900">{user.name}</td>
                <td className="px-4 py-3 text-ink-900/60">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    disabled={updatingId === user.id}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="rounded border border-ink-900/15 px-2 py-1 text-xs text-ink-900 outline-none focus:border-pitch-500"
                  >
                    <option value="USER">USER</option>
                    <option value="TURF_OWNER">TURF_OWNER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-ink-900/50">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}