'use client';
import { TypeParam } from '@ui/constants/index';
import { db } from '@ui/db';
import initTestQuestionThunk from '@ui/redux/repository/game/initData/initPracticeTest';
import { useAppDispatch } from '@ui/redux/store';
import IconGridTest from '@ui/components/icon/iconGridTest';
import clsx from 'clsx';
import RouterApp from '@ui/constants/router.constant';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import Link from 'next/link';
type IListTest = {
  id: number;
  duration: number;
};
const ItemTestLeft = ({
  test,
  index,
  id,
}: {
  test: IListTest;
  index: number;
  id: string;
}) => {
  return (
    <Link href={'#'}>
      <div
        className={clsx(
          'bg-white cursor-pointer p-2 hover:border-primary rounded-md border border-solid w-full flex items-center',
          {
            'border-primary': id === test?.id?.toString(),
          }
        )}
      >
        <div className=" bg-primary-16 rounded-md p-[6px] h-full aspect-square flex items-center justify-center">
          <IconGridTest />
        </div>
        <h3 className={clsx('text-xs  pl-3  pr-2 flex-1 truncate font-medium')}>
          Practice Tests {index + 1}
        </h3>
      </div>
    </Link>
  );
};

export default ItemTestLeft;
