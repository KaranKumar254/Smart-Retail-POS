import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
      const message = await forgotPassword(values.email);
      toast.success(message || 'Password reset instructions sent to your email');
      navigate('/reset-password', { state: { email: values.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send reset instructions');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email to receive reset instructions.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
          <Button type="submit" className="w-full py-3" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send reset link'}</Button>
        </form>
        <Link to="/login" className="mt-5 inline-block text-sm font-semibold text-primary-600">Back to login</Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
