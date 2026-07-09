import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const prefillEmail = location.state?.email || '';
  const prefillToken = location.state?.devResetToken || '';

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: prefillEmail, token: prefillToken },
  });

  const onSubmit = async (values) => {
    try {
      const message = await resetPassword(values.email, values.token, values.password);
      toast.success(message || 'Password updated — please log in');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Could not update password');
    }
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

        {/* Right panel — reset password form */}
        <div className="flex flex-col justify-center px-5 py-10 sm:px-10">

          {/* Mobile brand header */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">SR</div>
            <span className="text-base font-semibold text-slate-700">Smart Retail POS</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Reset password</h2>
              <p className="mt-1 text-sm text-slate-500">Enter the reset code you were sent, along with a new password.</p>
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
                label="Reset code"
                placeholder="Paste the code from your email"
                {...register('token', { required: 'Reset code is required' })}
                error={errors.token?.message}
              />
              <Input
                label="New password"
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                error={errors.password?.message}
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="Re-enter your new password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === watch('password') || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
              />
              <Button type="submit" className="w-full py-3 text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Updating…' : 'Update password'}
              </Button>
            </form>

            <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline">
              ← Return to login
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;