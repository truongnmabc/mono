'use client';
import { selectIsUnmount } from '@ui/redux/features/appInfo.reselect';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const WrapperAnimation = ({ children }: { children: React.ReactNode }) => {
  const isUnmount = useSelector(selectIsUnmount);

  return (
    <AnimatePresence initial={true}>
      {!isUnmount && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full pb-24 sm:pb-0  min-h-full flex flex-1 flex-col gap-4 sm:gap-6   h-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WrapperAnimation;
