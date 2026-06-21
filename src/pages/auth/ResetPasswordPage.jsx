import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const prefillEmail = location.state?.email || '';

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: prefillEmail },
  });

  const onSubmit = async (values) => {
    try {
      const message = await resetPassword(values.email, values.password);
      toast.success(message || 'Password updated successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">Set a strong new password for your team account.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
          <Input label="New password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} error={errors.password?.message} />
          <Input
            label="Confirm password"
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" className="w-full py-3" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update password'}</Button>
        </form>
        <Link to="/login" className="mt-5 inline-block text-sm font-semibold text-primary-600">Return to login</Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
