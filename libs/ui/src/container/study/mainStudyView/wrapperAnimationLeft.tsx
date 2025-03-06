'use client';
import { selectIsUnmount } from '@ui/redux/features/appInfo.reselect';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useSelector } from 'react-redux';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const isUnmount = useSelector(selectIsUnmount);
  return (
    <AnimatePresence initial={true}>
      {!isUnmount && (
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientLayout;
