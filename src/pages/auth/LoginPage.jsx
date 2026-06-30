import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const demoAccounts = [
  { label: 'Admin', email: 'admin@smartretail.com', password: 'Admin@123' },
  { label: 'Manager', email: 'manager@smartretail.com', password: 'Manager@123' },
  { label: 'Cashier', email: 'cashier@smartretail.com', password: 'Cashier@123' },
];

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back to Smart Retail POS');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fillDemo = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
    toast(`Filled ${account.label} credentials — press Login`, { icon: '🔑' });
  };

  return (
    <div className="min-h-screen bg-hero-grid bg-[size:24px_24px] px-4 py-8 sm:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl sm:rounded-[36px] lg:grid-cols-[1.1fr_0.9fr]">

        {/* Left panel — visible only on large screens */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-10 text-white lg:flex">
          <div>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 text-xl font-bold">SR</div>
            <h1 className="max-w-sm text-4xl font-bold leading-tight">Unified retail command center.</h1>
            <p className="mt-4 max-w-sm text-sm text-white/80">Track sales, manage stock, and run lightning-fast checkout — all in one place.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Real-time stock sync', 'Fast POS billing', 'Manager analytics', 'Downloadable reports'].map((f) => (
              <div key={f} className="rounded-2xl border border-white/15 bg-white/10 p-3 text-sm">{f}</div>
            ))}
          </div>
        </div>

        {/* Right panel — login form */}
        <div className="flex flex-col justify-center px-5 py-10 sm:px-10">

          {/* Mobile brand header */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">SR</div>
            <span className="text-base font-semibold text-slate-700">Smart Retail POS</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Sign in to continue</h2>
              <p className="mt-1 text-sm text-slate-500">Use your Smart Retail POS account credentials.</p>
            </div>

            {/* Demo quick-fill */}
            <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-primary-600">Demo accounts</p>
              <div className="flex flex-wrap gap-2">
                {demoAccounts.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => fillDemo(a)}
                    className="rounded-xl border border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm transition hover:bg-primary-100"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Tap a role to auto-fill credentials, then press Login.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@smartretail.com"
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                error={errors.password?.message}
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                  <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                  Remember me
                </label>
                <Link to="/forgot-password" className="font-semibold text-primary-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full py-3 text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Login to dashboard'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500">
              New team member?{' '}
              <span className="font-medium text-slate-700">Ask your Admin to create your account.</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ;
