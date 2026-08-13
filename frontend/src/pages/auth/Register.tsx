import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-display text-4xl uppercase text-ink-900">Create Account</h1>
      <p className="mt-2 text-ink-900/60">Join BuffTurf to start booking.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input label="Full Name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-900">I am a...</label>
          <select
            {...register('role')}
            className="rounded-md border border-ink-900/15 px-4 py-2.5 text-ink-900 outline-none focus:border-pitch-500"
          >
            <option value="USER">Player looking to book turfs</option>
            <option value="TURF_OWNER">Turf owner looking to list my ground</option>
          </select>
        </div>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-900/60">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-pitch-500">
          Log in
        </Link>
      </p>
    </div>
  );
}