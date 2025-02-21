import { TypeParam } from '@constants/index';
import { db } from '@shared-db';
import initTestQuestionThunk from '@shared-redux/repository/game/initData/initPracticeTest';
import { useAppDispatch } from '@shared-redux/store';
import IconGridTest from '@shared-uis/components/icon/iconGridTest';
import clsx from 'clsx';
import RouterApp from 'libs/constants/router.constant';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
type IListTest = {
  parentId: number;
  duration: number;
};
const ItemTestLeft = ({ test, index }: { test: IListTest; index: number }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const testId = useSearchParams()?.get('testId');

  const handleCLick = useCallback(async () => {
    const data = await db?.testQuestions
      .where('id')
      .equals(test.parentId)
      .first();
    if (data?.status === 0) {
      router.replace(
        `/study/${TypeParam.practiceTest}?type=practiceTests&testId=${test.parentId}`
      );
      dispatch(
        initTestQuestionThunk({
          testId: test.parentId,
        })
      );
    } else {
      const _href = `${RouterApp.ResultTest}?type=${TypeParam.practiceTest}&testId=${test.parentId}`;
      router.replace(_href);
    }
    return;
  }, [test.parentId, dispatch, router]);

  return (
    <div
      className={clsx(
        'bg-white cursor-pointer p-2 hover:border-primary rounded-md border border-solid w-full flex items-center',
        {
          'border-primary': testId === test?.parentId?.toString(),
        }
      )}
      onClick={handleCLick}
    >
      <div className=" bg-primary-16 rounded-md p-[6px] h-full aspect-square flex items-center justify-center">
        <IconGridTest />
      </div>
      <h3 className={clsx('text-xs  pl-3  pr-2 flex-1 truncate font-medium')}>
        Practice Tests {index + 1}
      </h3>
    </div>
  );
};

export default ItemTestLeft;
