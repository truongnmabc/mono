import clsx from 'clsx';
import { motion } from 'framer-motion';
import React from 'react';
import TitleIndex from './titleIndex';

// DONE
export const getKeyTest = (
  pathname: string | string[] | undefined
): string | null => {
  if (!pathname) return null;
  if (typeof pathname === 'string') {
    const name = pathname?.replace('-practice-test', '');
    return decodeURI(name.replaceAll('-', ' ')?.replaceAll('_', ' '));
  }
  return decodeURI(pathname[pathname?.length - 1]);
};

export const getLastPathSegment = (pathname?: string | null): string | null => {
  if (!pathname) {
    console.log('Pathname is empty');
    return null;
  }

  const segments = pathname?.split('/').filter(Boolean);

  const lastSegment =
    segments[segments.length - 1]?.replaceAll('_', ' ') || null;

  return lastSegment;
};

const TitleQuestion = ({ type, title }: { type?: string; title: string }) => {
  return (
    <div className={clsx('w-full flex items-center justify-center')}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center hidden sm:block capitalize text-xl font-semibold overflow-hidden border-transparent whitespace-nowrap"
      >
        {title} {type === 'learn' && <TitleIndex />}
      </motion.h1>
    </div>
  );
};

export default React.memo(TitleQuestion);
