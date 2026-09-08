import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'TURF_OWNER']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' },
  });

  async function onSubmit(data: RegisterForm) {
    setServerError(null);
    try {
      await registerUser(data);
      navigate('/');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Something went wrong');
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0E1713]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <Badge variant="emerald">Create Player / Owner Profile</Badge>
          <h1 className="mt-3 font-display text-3xl font-black uppercase text-white">
            Join BuffTurf
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Lock down pitch slots or list your own arena in minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="Cristiano Ronaldo"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="player@buffturf.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Account Type</label>
            <select
              {...register('role')}
              className="rounded-xl border border-emerald-500/20 bg-[#0C1410] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:bg-[#111C17]"
            >
              <option value="USER">⚽ Player (Discover & Book Pitches)</option>
              <option value="TURF_OWNER">🏟️ Arena Owner (List Grounds & Manage Slots)</option>
            </select>
          </div>

          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {serverError}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Creating Profile...' : 'Get Started ⚡'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}