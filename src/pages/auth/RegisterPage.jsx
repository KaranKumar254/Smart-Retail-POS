import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: 'Cashier' },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Could not create account');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid bg-[size:24px_24px] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-6 shadow-2xl sm:p-10"
      >
        {/* Brand */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">SR</div>
          <span className="text-sm font-semibold text-slate-600">Smart Retail POS</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create a team account</h2>
        <p className="mt-2 text-sm text-slate-500">Onboard admins, managers, and cashiers with role-based access.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4 space-y-4 sm:space-y-0">
            <Input
              label="Full name"
              placeholder="Aarav Sharma"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="aarav@smartretail.com"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
              {...register('role')}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Cashier</option>
            </select>
          </label>

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            error={errors.password?.message}
          />

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">Go to login</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default ;
