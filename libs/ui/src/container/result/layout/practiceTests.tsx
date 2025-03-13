import { MtUiButton } from '@ui/components/button';
import MyContainer from '@ui/components/container';
import { IGameMode } from '@ui/models/tests/tests';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';
import HeaderResultTest from '../header';
import ItemListTopicResult from '../listTopicResult/item';
import { useResultContext } from '../resultContext';

import DrawerAnswers from '../drawer';

const ReviewAnswerResult = dynamic(
  () => import('@ui/components/reviewAnswers'),
  {
    ssr: false,
  }
);
const PracticeTestsResult = ({
  isMobile,
  gameMode,
}: {
  isMobile: boolean;
  gameMode: IGameMode;
}) => {
  const {
    listTopic = [],
    isPass,
    correctIds,
    tableData,
    setTableData,
    topics = [],
  } = useResultContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);
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
        <HeaderResultTest isMobile={isMobile} gameMode={gameMode} />
      </motion.div>
      <MyContainer className="sm:pb-6 pb-4">
        {isMobile && (
          <Fragment>
            <div className="pt-4 sm:hidden">
              <MtUiButton
                block
                size="large"
                className="bg-white text-primary  border-primary"
                onClick={handleOpenDrawer}
              >
                Review your answers
              </MtUiButton>
              <DrawerAnswers
                openDrawer={openDrawer}
                handleCloseDrawer={handleCloseDrawer}
              />
            </div>
          </Fragment>
        )}
        {listTopic.length ? (
          <div className="text-lg my-2 font-medium  sm:hidden">
            Test Subjects
          </div>
        ) : (
          <></>
        )}
        <div className="w-full flex gap-10 justify-between  sm:mt-9">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 "
          >
            {listTopic?.map((item) => (
              <ItemListTopicResult
                item={item}
                key={item.id}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </div>

        <div className="text-2xl mt-6 font-semibold sm:block hidden">
          Review your answers
        </div>
        {!isMobile && (
          <div className={clsx('w-full flex flex-col pt-6  ')}>
            <ReviewAnswerResult
              tableData={tableData}
              setTableData={setTableData}
              listTopic={listTopic}
              correctIds={correctIds}
              topics={topics}
              isMobile={isMobile}
            />
          </div>
        )}
      </MyContainer>
    </Fragment>
  );
};

export default PracticeTestsResult;
