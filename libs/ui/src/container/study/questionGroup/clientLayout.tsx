'use client';
import { selectIsUnmount } from '@ui/redux/features/appInfo.reselect';
import { motion } from 'framer-motion';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const isUnmount = useSelector(selectIsUnmount);
  console.log('🚀 ~ ClientLayout ~ isUnmount:', isUnmount);
  return (
    <Fragment>
      {!isUnmount ? (
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : null}
    </Fragment>
  );
};

export default ClientLayout;
