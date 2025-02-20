'use client';
import IconReview from '@shared-uis/components/icon/iconReview';
import clsx from 'clsx';
import RouterApp from 'libs/constants/router.constant';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const IconReviewHeader = () => {
  const pathname = usePathname();
  if (pathname?.includes('/study') || pathname?.includes('_test')) {
    return (
      <Link href={RouterApp.Review}>
        <div className="hidden sm:flex item-center hover:text-primary  capitalize gap-3">
          <IconReview />
          <div
            className={clsx(
              'text-base font-normal cursor-pointer text-[var(--text-color)] hover:text-primary'
            )}
          >
            Review
          </div>
        </div>
      </Link>
    );
  }
  return null;
};

export default IconReviewHeader;
