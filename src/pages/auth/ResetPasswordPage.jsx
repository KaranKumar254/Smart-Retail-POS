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
    <div className="flex min-h-screen items-center justify-center bg-hero-grid bg-[size:24px_24px] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-2xl sm:p-10"
      >
        {/* Brand */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">SR</div>
          <span className="text-sm font-semibold text-slate-600">Smart Retail POS</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter the reset code you were sent, along with a new password.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
          <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>

        <Link to="/login" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline">
          ← Return to login
        </Link>
      </motion.div>
    </div>
  );
}

export default ResetPasswordPage;