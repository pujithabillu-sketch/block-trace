import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex-1 bg-[#F8FAFC] min-h-[calc(100vh-72px)] p-5 sm:p-8 lg:p-[36px] w-full max-w-none transition-all duration-200">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};
