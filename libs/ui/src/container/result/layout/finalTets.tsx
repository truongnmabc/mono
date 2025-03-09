import MyContainer from '@ui/components/container';
import { IGameMode } from '@ui/models/tests/tests';
import clsx from 'clsx';
import { Fragment } from 'react';
import ItemListTopicResult from '../listTopicResult/item';
import { motion } from 'framer-motion';
import ReviewAnswerResult from '@ui/components/reviewAnswers';
import { useResultContext } from '../resultContext';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { useAppSelector } from '@ui/redux';
import dynamic from 'next/dynamic';

const HeaderResultTest = dynamic(() => import('../header'), {
  ssr: false,
});

const HeaderFinalTestNotPro = dynamic(
  () => import('../header/headerFinalTestNotPro'),
  {
    ssr: false,
  }
);
const FinalTestsResult = ({
  isMobile,
  gameMode,
}: {
  isMobile: boolean;
  gameMode: IGameMode;
}) => {
  const { listTopic, isPass, correctIds, tableData, setTableData, topics } =
    useResultContext();
  const userInfo = useAppSelector(selectUserInfo);

  return (
    <Fragment>
      {userInfo.isPro ? (
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={clsx('bg-white  ', {
            'sm:bg-[#FFE1E1]': !isPass,
            'sm:bg-[#F2FFFB]': isPass,
          })}
        >
          <HeaderResultTest isMobile={isMobile} gameMode={gameMode} />
        </motion.div>
      ) : (
        <MyContainer className="sm:pt-12">
          <HeaderFinalTestNotPro isMobile={isMobile} />
        </MyContainer>
      )}
      <MyContainer className="sm:pb-6 pb-4">
        {userInfo.isPro && (
          <div className="w-full flex gap-10 justify-between  sm:mt-9">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 "
            >
              {listTopic.map((item) => (
                <ItemListTopicResult
                  item={item}
                  key={item.id}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>
          </div>
        )}

        <div className="text-2xl mt-6 font-semibold sm:block hidden">
          Review your answers
        </div>
        <div className={clsx('w-full flex flex-col pt-6  ')}>
          <ReviewAnswerResult
            tableData={tableData}
            setTableData={setTableData}
            listTopic={listTopic}
            correctIds={correctIds}
            topics={topics}
            isMobile={isMobile}
            type={isMobile ? 'custom' : 'default'}
          />
        </div>
      </MyContainer>
    </Fragment>
  );
};

export default FinalTestsResult;
