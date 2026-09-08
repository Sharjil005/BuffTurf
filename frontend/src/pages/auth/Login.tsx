import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    setServerError(null);
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Something went wrong');
    }
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0E1713]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <Badge variant="emerald">Player & Owner Access</Badge>
          <h1 className="mt-3 font-display text-3xl font-black uppercase text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Sign in to access your match passes and arena reservations.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
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
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {serverError}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Authenticating...' : 'Sign In ⚡'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          New to BuffTurf?{' '}
          <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}