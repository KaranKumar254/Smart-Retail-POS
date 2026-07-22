import logo from "@/assets/logo.png";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiBarChart2,
  FiCreditCard,
  FiPackage,
  FiCheck,
  FiLoader,
} from 'react-icons/fi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const demoAccounts = [
  { label: 'Admin', email: 'admin@smartretail.com', password: 'Admin@123', badge: 'hover:border-indigo-500 hover:bg-indigo-50/30 hover:text-indigo-600 text-slate-700' },
  { label: 'Manager', email: 'manager@smartretail.com', password: 'Manager@123', badge: 'hover:border-purple-500 hover:bg-purple-50/30 hover:text-purple-600 text-slate-700' },
  { label: 'Cashier', email: 'cashier@smartretail.com', password: 'Cashier@123', badge: 'hover:border-emerald-500 hover:bg-emerald-50/30 hover:text-emerald-600 text-slate-700' },
];

const features = [
  { label: "Secure Gateway", icon: FiShield },
  { label: "Real-time Inventory", icon: FiPackage },
  { label: "Smart Ledger & Billing", icon: FiCreditCard },
  { label: "Predictive Analytics", icon: FiBarChart2 },
];

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');

  const onSubmit = async (values) => {
    try {
      await login(values);
      setStatus('success');
      toast.success('Welcome back to Smart Retail POS');
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    }
  };

  const fillDemo = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
    toast(`Active Session: ${account.label}`, { icon: '🔑' });
  };

  const busy = isSubmitting || status === 'success';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] bg-hero-grid bg-[size:32px_32px] px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center justify-center font-sans antialiased">
      
      <div className="w-full max-w-5xl z-10 my-auto">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] lg:grid-cols-[1fr_1fr] lg:h-[580px]">

          {/* Left Hero Panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0f172a] p-8 xl:p-10 text-white lg:flex border-r border-slate-800">
            <div className="pointer-events-none absolute -left-10 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

            {/* Desktop Brand Header */}
            <div className="relative z-10 flex items-center gap-3">
              <div 
                className="h-10 w-14 shrink-0 rounded-lg bg-center bg-cover bg-no-repeat shadow-md border border-slate-800"
                style={{ backgroundImage: `url(${logo})` }}
                role="img"
                aria-label="Smart Retail Logo"
              />
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white leading-none">SMART RETAIL</h2>
                <p className="text-[9px] font-semibold tracking-[0.2em] text-indigo-400 uppercase mt-0.5">Enterprise POS</p>
              </div>
            </div>

            {/* Main Catchphrase Copy */}
            <div className="relative z-10 my-auto py-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-xs text-2xl xl:text-3xl font-semibold tracking-tight leading-[1.2] text-slate-100"
              >
                Unified retail command center.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
                className="mt-2.5 max-w-xs text-xs leading-relaxed text-slate-400"
              >
                Optimize inventory flow, scale customer touchpoints, and monitor business intelligence from a modern framework.
              </motion.p>

              {/* Mockup Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative mt-6 w-64 rounded-xl border border-white/5 bg-white/[0.01] p-4 shadow-[0_25px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl ring-1 ring-white/5"
              >
                <div className="flex items-center justify-between text-[10px] font-medium tracking-wide text-slate-400">
                  <span>Gross revenue snapshot</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="mt-3 flex items-end gap-1.5 h-10">
                  {[35, 55, 40, 75, 50, 95, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-[1px] bg-gradient-to-t from-indigo-500/30 to-indigo-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/5 px-2.5 py-1.5 text-[11px]">
                  <span className="text-slate-400">Today's Yield</span>
                  <span className="font-semibold text-slate-200">₹42,180.00</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Features Row */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 border-t border-slate-800/40 pt-4">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <f.icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="truncate">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Core Form Panel */}
          <div className="flex flex-col justify-center px-4 py-4 sm:px-6 xl:px-8 bg-slate-50/40 overflow-hidden">
            
            {/* Adaptive Mobile Header */}
            <div className="flex items-center gap-3 mb-4 lg:hidden border-b border-slate-100 pb-2">
              <div 
                className="h-9 w-12 shrink-0 rounded-md bg-center bg-cover bg-no-repeat shadow-sm"
                style={{ backgroundImage: `url(${logo})` }}
                role="img"
                aria-label="Smart Retail Logo"
              />
              <div>
                <h2 className="text-sm font-bold tracking-tight text-slate-900 leading-none">SMART RETAIL</h2>
                <p className="text-[9px] font-bold tracking-[0.15em] text-indigo-600 uppercase mt-0.5">POS Platform</p>
              </div>
            </div>

            {/* Account Sign-In Form Box with premium Blue Border configuration */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm mx-auto bg-white border border-blue-500/80 shadow-[0_10px_30px_rgba(59,130,246,0.04)] ring-4 ring-blue-50/40 rounded-2xl p-5 xl:p-6 space-y-4"
            >
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Account Sign In
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                  Provide your credentials below to access security framework.
                </p>
              </div>

              {/* Profiles Box */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                  Quick Access Profiles
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {demoAccounts.map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => fillDemo(a)}
                      className={`flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 focus:outline-none ${a.badge}`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Forms */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Input
                  label="Corporate Email"
                  type="email"
                  icon={FiMail}
                  placeholder="name@smartretail.com"
                  {...register('email', { required: 'Corporate Email is required' })}
                  error={errors.email?.message}
                />
                
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={FiLock}
                  placeholder="••••••••"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100"
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff className="h-3.5 w-3.5" /> : <FiEye className="h-3.5 w-3.5" />}
                    </button>
                  }
                  {...register('password', { required: 'Password validation required' })}
                  error={errors.password?.message}
                />

                <div className="flex items-center justify-between text-[11px] pt-0.5 select-none">
                  <label className="flex cursor-pointer items-center gap-1.5 text-slate-400">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 h-3.5 w-3.5 transition duration-150" defaultChecked />
                    Keep active
                  </label>
                  <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-700 transition">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-2 mt-1 text-xs font-medium tracking-wide bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_4px_10px_rgba(79,70,229,0.1)] transition-all duration-150 disabled:bg-slate-100 disabled:text-slate-400"
                  disabled={busy}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {status === 'success' ? (
                      <motion.span key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-1.5">
                        <FiCheck className="h-3.5 w-3.5 stroke-[2.5]" /> Session Verified
                      </motion.span>
                    ) : isSubmitting ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-1.5">
                        <FiLoader className="h-3.5 w-3.5 animate-spin" /> Verifying…
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Authenticate Profile
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>

              <p className="text-center text-[10px] text-slate-400 leading-none pt-0.5">
                Unauthorized entry barred.{' '}
                <span className="font-medium text-slate-500 block sm:inline">Contact systems admin.</span>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 border-t border-slate-100 pt-3">
                <FiShield className="h-3 w-3 text-emerald-500 shrink-0" />
                TLS End-to-End Encrypted Session Link
              </div>
            </motion.div>
          </div>
        </div>

        {/* Corporate Typography Footer */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] tracking-wide text-slate-400/80 px-2">
          <p>© Smart Retail POS Systems LLC. All rights reserved.</p>
          <div className="flex items-center gap-2.5">
            <span>v1.0.0 Production Cluster</span>
            <span className="h-2 w-px bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
