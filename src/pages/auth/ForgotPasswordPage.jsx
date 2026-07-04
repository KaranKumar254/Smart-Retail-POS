import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      const result = await forgotPassword(values.email);
      toast.success(result?.message || 'If this email is registered, reset instructions have been sent');

      // No email provider is wired up yet, so the backend returns the reset
      // token directly in non-production environments so the flow is
      // testable end-to-end. Once real email delivery is added, drop this
      // and just send the user to a "check your email" screen instead.
      navigate('/reset-password', {
        state: { email: values.email, devResetToken: result?.devResetToken },
      });
    } catch (error) {
      toast.error(error.message || 'Could not send reset instructions');
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

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Forgot password?</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your work email and we'll send you reset instructions.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Work email"
            type="email"
            placeholder="you@smartretail.com"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
          <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send reset instructions'}
          </Button>
        </form>

        <Link to="/login" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline">
          ← Back to login
        </Link>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;