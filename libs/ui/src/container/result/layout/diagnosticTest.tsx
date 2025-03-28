import MyContainer from '@ui/components/container';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { IGameMode } from '@ui/models/tests/tests';
import { startTryAgainDiagnostic } from '@ui/redux';
import { useAppDispatch } from '@ui/redux/store';
import { updateDbTestQuestions } from '@ui/utils/updateDb';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { Fragment } from 'react';
import HeaderResultDiagnostic from '../header/headerResultDiagnostic';
import ItemListTopicResult from '../listTopicResult/item';
import { useResultContext } from '../resultContext';
const DiagnosticTestResult = ({
  isMobile,
}: {
  isMobile: boolean;
  gameMode: IGameMode;
}) => {
  const { listTopic, isPass, correct, total, resultId } = useResultContext();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleTryAgain = async () => {
    await updateDbTestQuestions({
      id: resultId || -1,
      data: {
        isGamePaused: false,
        elapsedTime: 0,
        status: 0,
      },
      isUpAttemptNumber: true,
    });
    const param = queryString.stringify({
      type: TypeParam.diagnosticTest,
      testId: resultId,
    });
    dispatch(startTryAgainDiagnostic());
    router.push(`${RouterApp.Diagnostic_test}?${param}`);
  };
  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={clsx('bg-white  ', {
          'sm:bg-[#FFE1E1]': !isPass,
          'sm:bg-[#F2FFFB]': isPass,
        })}
      >
        <HeaderResultDiagnostic
          handleTryAgain={handleTryAgain}
          percentage={(correct / total) * 100 || 0}
          isMobile={false}
        />
      </motion.div>
      <MyContainer className="sm:pb-6 pb-4">
        <div className="w-full flex gap-10 justify-between  sm:mt-9">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 "
          >
            {listTopic.map((item) => (
              <ItemListTopicResult
                isMobile={isMobile}
                item={item}
                key={item.id}
              />
            ))}
          </motion.div>
        </div>
      </MyContainer>
    </Fragment>
  );
};

export default DiagnosticTestResult;
