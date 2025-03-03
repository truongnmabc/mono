'use client';
import CloseIcon from '@ui/asset/icon/CloseIcon';
import { MtUiButton } from '@ui/components/button';
import MyContainer from '@ui/components/container';
import { TypeParam, listBranchTest } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { db } from '@ui/db';
import { selectAppInfo } from '@ui/redux/features/appInfo.reselect';
import {
  shouldCreateNewTest,
  startTryAgainDiagnostic,
} from '@ui/redux/features/game';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import initCustomTestThunk from '@ui/redux/repository/game/initData/initCustomTest';
import initDiagnosticTestQuestionThunk from '@ui/redux/repository/game/initData/initDiagnosticTest';
import initFinalTestThunk from '@ui/redux/repository/game/initData/initFinalTest';
import initPracticeThunk from '@ui/redux/repository/game/initData/initPracticeTest';
import { handleNavigateStudy } from '@ui/utils/handleNavigateStudy';
import { updateDbTestQuestions } from '@ui/utils/updateDb';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { IconFailResultTest } from '../icon/iconFailResultTest';
import { IconPassResultTest } from '../icon/iconPassResultTest';
import { useResultContext } from '../resultContext';
import DashboardCard from './chartHeader';
import HeaderResultDiagnostic from './headerResultDiagnostic';
import { TitleMiss, TitlePass } from './titleResultTest';

const HeaderResultTest = () => {
  const { correct, total, isPass, passing } = useResultContext();
  const router = useRouter();
  const type = useSearchParams()?.get('type');
  const dispatch = useAppDispatch();
  const testId = useSearchParams()?.get('testId');
  const index = useSearchParams()?.get('index');
  /**
   *
   * Với practice test thì bài cuối (trong db sẽ không còn bài nào chưa làm status = 0) sẽ không hiển thị button next
   *
   */
  const [isLast, setIsLast] = useState(true);
  const appInfo = useAppSelector(selectAppInfo);
  useEffect(() => {
    if (type === TypeParam.practiceTest) {
      const checkIsLast = async () => {
        const isLast = await db?.testQuestions
          .where('gameMode')
          .equals('practiceTests')
          .filter((item) => item.status === 0)
          .first();
        if (!isLast) setIsLast(true);
        else setIsLast(false);
      };
      checkIsLast();
    } else {
      setIsLast(false);
    }
  }, [type]);

  const handleTryAgain = useCallback(async () => {
    let _href = '';

    const id = Number(testId);

    if (id)
      await updateDbTestQuestions({
        id: Number(id),
        data: {
          isGamePaused: false,
          elapsedTime: 0,
          status: 0,
        },
        isUpAttemptNumber: true,
      });
    switch (type) {
      case TypeParam.diagnosticTest:
        dispatch(startTryAgainDiagnostic());
        dispatch(initDiagnosticTestQuestionThunk({ id: id }));
        _href = RouterApp.Diagnostic_test;
        break;

      case TypeParam.finalTest:
        dispatch(initFinalTestThunk({ id }));
        _href = RouterApp.Final_test;
        break;

      case TypeParam.practiceTest:
        dispatch(initPracticeThunk({ testId: id }));
        _href = `/study/${TypeParam.practiceTest}?type=practiceTests&testId=${id}&index=${index}`;
        break;
      case TypeParam.branchTest:
        dispatch(initPracticeThunk({ testId: id }));
        const title = listBranchTest[Number(index) - 1 || 0].title;
        _href = `/study/${title}-${appInfo.appShortName}-practice-test?type=${TypeParam.branchTest}&testId=${id}&index=${index}`;

        break;
      case TypeParam.customTest:
        await dispatch(
          initCustomTestThunk({
            testId: id,
          })
        );
        _href = `${RouterApp.Custom_test}?testId=${id}`;
        break;

      case TypeParam.review:
        _href = RouterApp.Review;
        break;

      default:
        return;
    }

    if (_href) {
      router.replace(_href);
    }
  }, [router, dispatch, type, testId, index, appInfo]);

  const handleNextTets = useCallback(async () => {
    if (type === TypeParam.practiceTest || type === TypeParam.branchTest) {
      const listTest = await db?.testQuestions
        .where('gameMode')
        .equals(type)
        .toArray();
      const index = listTest?.findIndex((item) => item.status === 0) || 0;

      const currentTest = listTest?.[index];

      dispatch(initPracticeThunk({ testId: currentTest?.id || -1 }));
      const _href = `/study/${
        type === TypeParam.practiceTest
          ? TypeParam.practiceTest
          : `${listBranchTest[index].title}-${appInfo.appShortName}-practice-test`
      }?type=${type}&testId=${currentTest?.id}&index=${index + 1}`;
      router.push(_href, {
        scroll: true,
      });
      return;
    }
    if (type === TypeParam.customTest) {
      dispatch(shouldCreateNewTest(true));
      router.push(`${RouterApp.Custom_test}?isCreate=true`, {
        scroll: true,
      });
      return;
    }
  }, [router, type, dispatch, appInfo]);

  const handleStartLearning = useCallback(async () => {
    const listTopic = await db?.topics.toArray();
    if (listTopic?.length) {
      handleNavigateStudy({
        dispatch,
        router,
        topic: listTopic[0],
        isReplace: true,
      });
    }
  }, [dispatch, router]);

  const back = useCallback(() => router.push(RouterApp.Home), [router]);

  if (type === TypeParam.diagnosticTest) {
    return (
      <HeaderResultDiagnostic
        handleStartLearning={handleStartLearning}
        handleTryAgain={handleTryAgain}
        handleBack={back}
        percentage={(correct / total) * 100}
      />
    );
  }

  return (
    <MyContainer className="py-4 sm:py-8 flex flex-col sm:flex-row sm:gap-8">
      <div
        className="w-10 h-10 rounded-full cursor-pointer bg-[#21212114] sm:bg-white flex items-center justify-center"
        onClick={back}
      >
        <CloseIcon />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-10 items-end">
        <div className="w-full flex justify-center sm:w-[234px] sm:h-[232px]">
          {isPass ? <IconPassResultTest /> : <IconFailResultTest />}
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-hidden justify-between h-full sm:pt-16">
          <div className="flex-1">{isPass ? <TitlePass /> : <TitleMiss />}</div>
          <div className="fixed bottom-0 py-4 px-4 left-0 right-0 z-50 bg-theme-dark sm:bg-transparent sm:static flex gap-4 sm:gap-6 items-center">
            <MtUiButton
              className="sm:py-4 sm:max-h-14 text-lg bg-white font-medium rounded-2xl text-primary border-primary"
              block
              size="large"
              onClick={handleTryAgain}
            >
              Try Again
            </MtUiButton>
            {(((type === TypeParam.practiceTest ||
              type === TypeParam.branchTest) &&
              !isLast) ||
              type === TypeParam.customTest) && (
              <MtUiButton
                className="sm:py-4 sm:max-h-14 text-lg font-medium rounded-2xl "
                block
                type="primary"
                size="large"
                onClick={handleNextTets}
              >
                {type === TypeParam.customTest ? 'New Test' : 'Continue'}
              </MtUiButton>
            )}
          </div>
        </div>
        <DashboardCard
          correct={correct}
          total={total}
          percent={(correct / total) * 100}
          passing={passing}
        />
      </div>
    </MyContainer>
  );
};

export default React.memo(HeaderResultTest);
