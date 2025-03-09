import Empty from '@ui/components/empty';
import MtUIInfinity from '@ui/components/infiniteScroller';
import QuestionResult from '@ui/components/questionReview';
import { IQuestionOpt } from '@ui/models';
import { ICurrentGame } from '@ui/models/game';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
interface TabPanelProps {
  data: ICurrentGame[];
  type?: 'default' | 'custom';
  isMobile?: boolean;
  emptyMessage?: string;
}
const paginateData = (data: IQuestionOpt[], limit: number) => {
  const paginatedArray = [];
  for (let i = 0; i < data.length; i += limit) {
    paginatedArray.push(data.slice(i, i + limit));
  }
  return paginatedArray;
};
function TabPanelReview(props: TabPanelProps) {
  const { data, type, isMobile, emptyMessage } = props;
  const [currentReviews, setCurrentReviews] = useState<IQuestionOpt[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [allReviews, setAllReviews] = useState<IQuestionOpt[][]>([]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const getAppReviews = async () => {
      const newList = paginateData(data, 10);
      setAllReviews(newList);
      setCurrentReviews(newList[0]);
    };
    getAppReviews();
  }, [data]);

  useEffect(() => {
    if (page > 0 && allReviews.length) {
      const nextData = allReviews[page];
      if (nextData && nextData.length > 0) {
        setCurrentReviews((prev) => [...prev, ...nextData]);
        setIsFetchingNextPage(false);
      }
    }
  }, [page, allReviews]);

  const fetchNextPage = (page: number) => {
    setPage(page);
    setIsFetchingNextPage(true);
  };
  return (
    <MtUIInfinity
      fetchNextPage={fetchNextPage}
      total={data?.length}
      dataLength={currentReviews?.length}
      isScrollPage={true}
      pageScrollId="pageScroll"
      isFetchingNextPage={isFetchingNextPage}
      classNames="min-h-96"
    >
      {currentReviews?.map((item, index) => (
        <motion.div
          key={item.id}
          className="py-2 bg-transparent"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <QuestionResult
            item={item}
            type={type}
            isMobile={isMobile || false}
          />
        </motion.div>
      ))}
      {data?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5 }}
          className="w-full min-h-96 h-full bg-white rounded-lg flex items-center justify-center"
        >
          <Empty title={emptyMessage} />
        </motion.div>
      )}
    </MtUIInfinity>
  );
}

export default TabPanelReview;
