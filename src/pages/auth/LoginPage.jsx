import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back to Smart Retail POS');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-hero-grid bg-[size:24px_24px] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl grid-cols-1 overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-10 text-white lg:flex">
          <div>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 text-xl font-bold">SR</div>
            <h1 className="max-w-md text-4xl font-bold leading-tight">Unified retail operations with a premium omnichannel command center.</h1>
            <p className="mt-5 max-w-lg text-sm text-white/85">Track store sales, warehouse stock, and lightning-fast checkout from one polished interface.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Real-time stock sync', 'Fast POS billing', 'Manager analytics', 'Downloadable reports'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm">{item}</div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Light mode experience</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Sign in to continue</h2>
              <p className="mt-2 text-sm text-slate-500">Sign in with your Smart Retail POS account.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
              <Input label="Password" type="password" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" className="rounded border-slate-300" defaultChecked /> Remember me
                </label>
                <Link to="/forgot-password" className="font-semibold text-primary-600">Forgot password</Link>
              </div>
              <Button type="submit" className="w-full py-3" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login to dashboard'}</Button>
            </form>
            <p className="text-sm text-slate-500">New team member? Ask your Admin to create your account.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
