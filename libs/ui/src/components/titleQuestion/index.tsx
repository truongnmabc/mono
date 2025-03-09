import clsx from 'clsx';
import { motion } from 'framer-motion';
import React from 'react';
import dynamic from 'next/dynamic';
import { TypeParam } from '@ui/constants';
import { IGameMode } from '@ui/models/tests/tests';
const TitleIndex = dynamic(() => import('./titleIndex'), {
  ssr: false,
});
// DONE

const TitleQuestion = ({
  type,
  title,
}: {
  type?: IGameMode;
  title: string;
}) => {
  return (
    <div className={clsx('w-full flex items-center justify-center')}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center hidden sm:block capitalize text-xl font-semibold overflow-hidden border-transparent whitespace-nowrap"
      >
        {title} {type !== TypeParam.branchTest && <TitleIndex type={type} />}
      </motion.h1>
    </div>
  );
};

export default React.memo(TitleQuestion);
