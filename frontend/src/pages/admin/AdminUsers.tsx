import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, type AdminUser } from '../../services/api/admin';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

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

  if (!users) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="mt-3 font-mono text-xs text-amber-400">Loading platform accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-amber-500/10 pb-4">
        <Badge variant="amber">Account Governance</Badge>
        <h1 className="mt-2 font-display text-3xl font-black uppercase text-white">
          Platform Users ({users.length})
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage registered players, arena owners, and system administrators.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-emerald-500/10 bg-[#090D0B] text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider">User</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider">System Role</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="rounded-lg border border-emerald-500/30 bg-[#121E18] px-3 py-1.5 text-xs font-bold text-slate-100 outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="USER" className="bg-[#121E18] text-white">USER (Player)</option>
                      <option value="TURF_OWNER" className="bg-[#121E18] text-emerald-400">TURF_OWNER (Arena)</option>
                      <option value="ADMIN" className="bg-[#121E18] text-amber-400">ADMIN (Full Access)</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}