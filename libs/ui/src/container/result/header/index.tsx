'use client';

import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { db } from '@ui/db';
import { useAppDispatch } from '@ui/redux/store';

import { updateDbTestQuestions } from '@ui/utils/updateDb';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useResultContext } from '../resultContext';

import { IGameMode } from '@ui/models/tests/tests';
import dynamic from 'next/dynamic';
import queryString from 'query-string';
const HeaderDefault = dynamic(() => import('./headerDefault'), {
  ssr: false,
});
const HeaderResultTest = ({
  gameMode,
}: {
  isMobile: boolean;
  gameMode?: IGameMode;
}) => {
  const { correct, total, isPass, passing, resultId, branchTest } =
    useResultContext();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLast, setIsLast] = useState(true);

  useEffect(() => {
    if (
      gameMode === TypeParam.practiceTests ||
      gameMode === TypeParam.branchTest
    ) {
      const checkIsLast = async () => {
        const list = await db?.testQuestions
          .where('gameMode')
          .equals(gameMode)
          .toArray();
        const listNotCompleted = list?.filter((item) => item.status === 0);
        const isLast = listNotCompleted?.length === 0;
        setIsLast(isLast);
      };
      checkIsLast();
    } else {
      setIsLast(false);
    }
  }, [gameMode]);

  const handleTryAgain = useCallback(async () => {
    if (resultId)
      await updateDbTestQuestions({
        id: resultId,
        data: {
          isGamePaused: false,
          elapsedTime: 0,
          status: 0,
        },
        isUpAttemptNumber: true,
      });
    const param = queryString.stringify({
      type: gameMode,
      testId: resultId,
    });

    router.push(
      `${
        gameMode === TypeParam.practiceTests
          ? RouterApp.Practice_Tests
          : gameMode === TypeParam.customTests
          ? RouterApp.Custom_test
          : gameMode === TypeParam.finalTests
          ? RouterApp.Final_test
          : gameMode === TypeParam.diagnosticTest
          ? RouterApp.Diagnostic_test
          : branchTest?.find((item) => item.id === resultId)?.slug
      }?${param}`,
      {
        scroll: true,
      }
    );
  }, [router, , gameMode, resultId]);

  const handleNextTets = useCallback(async () => {
    const listTest = await db?.testQuestions
      .where('gameMode')
      .equals(gameMode || TypeParam.practiceTests)
      .toArray();
    const nextTest = listTest?.find((item) => item.status === 0);
    if (gameMode === TypeParam.customTests && !nextTest) {
      const param = queryString.stringify({
        type: gameMode,
        testId: -1,
        isCreate: true,
      });
      router.push(`${RouterApp.Custom_test}?${param}`, {
        scroll: true,
      });
      return;
    }
    if (!nextTest) return;
    const param = queryString.stringify({
      type: gameMode,
      testId: nextTest?.id,
    });

    router.push(
      `${
        gameMode === TypeParam.practiceTests
          ? RouterApp.Practice_Tests
          : gameMode === TypeParam.customTests
          ? RouterApp.Custom_test
          : branchTest?.find((item) => item.id === resultId)?.slug
      }?${param}`,
      {
        scroll: true,
      }
    );
  }, [router, gameMode, dispatch]);

  return (
    <HeaderDefault
      isPass={isPass}
      correct={correct}
      total={total}
      passing={passing}
      handleTryAgain={handleTryAgain}
      handleNextTets={handleNextTets}
      type={gameMode as IGameMode}
      isLast={isLast}
    />
  );
};

export default React.memo(HeaderResultTest);
