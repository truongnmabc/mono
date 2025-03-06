'use client';
import { selectIsUnmountPrevious } from '@ui/redux/features/appInfo.reselect';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useSelector } from 'react-redux';
const WrapperAnimation = ({ children }: { children: React.ReactNode }) => {
  const isUnmount = useSelector(selectIsUnmountPrevious);

  return (
    <AnimatePresence initial={true}>
      {isUnmount && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full py-6 h-full gap-8 flex flex-col"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WrapperAnimation;
