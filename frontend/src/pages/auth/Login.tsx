import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-display text-4xl uppercase text-ink-900">Welcome Back</h1>
      <p className="mt-2 text-ink-900/60">Log in to book your next game.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-900/60">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-pitch-500">
          Sign up
        </Link>
      </p>
    </div>
  );
}