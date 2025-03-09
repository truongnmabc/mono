'use client';
import IconReview from '@ui/components/icon/iconReview';
import clsx from 'clsx';
import RouterApp from '@ui/constants/router.constant';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TypeParam } from '@ui/constants';

const IconReviewHeader = () => {
  const pathname = usePathname();
  if (pathname?.includes('-test') || pathname?.includes('_test')) {
    return (
      <Link href={`${RouterApp.Review}?mode=random&type=${TypeParam.review}`}>
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
