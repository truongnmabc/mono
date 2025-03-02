'use client';
import { selectCurrentSubTopicIndex } from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';
import clsx from 'clsx';
import { useParams, usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
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

const TitleQuestion = ({ type }: { type?: string }) => {
  const params = useParams();
  const pathname = usePathname();
  const defaultTitle = useMemo(
    () => getKeyTest(params?.['slug']) || getLastPathSegment(pathname),
    [params, pathname]
  );
  const index = useAppSelector(selectCurrentSubTopicIndex);
  return (
    <div
      className={clsx(
        'w-full text-center hidden sm:block capitalize text-xl font-semibold'
      )}
    >
      {defaultTitle} {type === 'learn' ? `- Core ${index}` : ''}
    </div>
  );
};

export default React.memo(TitleQuestion);
