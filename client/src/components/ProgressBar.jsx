import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, max = 100 }) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
