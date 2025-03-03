// import AllowExpand from '@ui/components/allowExpand';
// import AllowExpandProvider from '@ui/components/allowExpand/provider';
import { db } from '@ui/db';
import { ITopicBase } from '@ui/models/topics';
import { selectTopics } from '@ui/redux/features/study';
import { useAppDispatch } from '@ui/redux/store';
import clsx from 'clsx';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const GridTopicProgress = () => {
  const [listSubTopics, setListSubTopics] = useState<ITopicBase | null>();
  const slug = useSearchParams()?.get('topic');
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const handleGetData = useCallback(async () => {
    if (slug) {
      const data = await db?.topics.where('slug').equals(slug).first();
      if (data) {
        dispatch(selectTopics(data.id));
        setListSubTopics(data as ITopicBase);
      }
    }
  }, [slug, dispatch]);

  useEffect(() => {
    handleGetData();
  }, [slug, handleGetData]);

  if (listSubTopics) {
    return (
      <div
        className={clsx('w-full h-full rounded-md  bg-white', {
          'p-3': pathname?.includes('/finish'),
        })}
      >
        {/* <AllowExpandProvider topic={listSubTopics}>
          <AllowExpand />
        </AllowExpandProvider> */}
      </div>
    );
  }
  return null;
};

export default GridTopicProgress;
