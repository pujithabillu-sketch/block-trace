import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Querying Algorand blockchain state...',
  minHeight = 'min-h-[240px]',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${minHeight} bg-white/70 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-xs`}
    >
      <div className="relative flex items-center justify-center mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-3 border-teal-100 border-t-teal-600 shadow-xs"
        />
        <Shield className="w-5 h-5 text-teal-600 absolute animate-pulse" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1 font-mono">Reading Box Map records & state</p>
    </motion.div>
  );
};
