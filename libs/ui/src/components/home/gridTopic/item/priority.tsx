'use client';
import MtUiSkeleton from '@ui/components/loading-skeleton';
import clsx from 'clsx';
import RouterApp from '@ui/constants/router.constant';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const Priority = ({ priority, name }: { priority: number; name: string }) => {
  const pathname = usePathname();

  return (
    <Fragment>
      {priority == 1 && (
        <h1
          className={clsx('pl-3 pr-2 text-xs flex-1 truncate font-medium', {
            'sm:text-lg text-base': pathname === RouterApp.Home,
          })}
        >
          {name ? name : <MtUiSkeleton className="min-h-6 " />}
        </h1>
      )}
      {priority == 2 && (
        <h2
          className={clsx('text-xs  pr-2 pl-3 flex-1 truncate font-medium', {
            'sm:text-lg text-base': pathname === RouterApp.Home,
          })}
        >
          {name ? name : <MtUiSkeleton className="min-h-6 " />}
        </h2>
      )}
      {priority == 3 && (
        <h3
          className={clsx(' pl-3  pr-2 flex-1 truncate font-medium', {
            'sm:text-lg text-base': pathname === RouterApp.Home,
            'text-xs': pathname !== RouterApp.Home,
          })}
        >
          {name ? name : <MtUiSkeleton className="min-h-6 " />}
        </h3>
      )}
      {priority == 4 && (
        <h4
          className={clsx('text-xs pl-3  pr-2 flex-1 truncate font-medium', {
            'sm:text-lg text-base': pathname === RouterApp.Home,
          })}
        >
          {name ? name : <MtUiSkeleton className="min-h-6 " />}
        </h4>
      )}
    </Fragment>
  );
};

export default Priority;
