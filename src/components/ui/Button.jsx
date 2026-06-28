import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-200 hover:opacity-95',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
  success: 'bg-gradient-to-r from-accent-500 to-emerald-500 text-white shadow-lg shadow-emerald-100 hover:opacity-95',
  ghost: 'bg-white/70 text-slate-700 hover:bg-white',
  danger: 'bg-rose-500 text-white hover:bg-rose-600',
};

function Button({ children, className, variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default ;
