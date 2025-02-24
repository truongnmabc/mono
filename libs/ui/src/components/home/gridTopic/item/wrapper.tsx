'use client';
import { db } from '@ui/db';
import { ITopicBase } from '@ui/models/topics';
import AllowExpandProvider from '@ui/components/allowExpand/provider';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
const AllowExpand = dynamic(() => import('@ui/components/allowExpand'), {
  ssr: false,
});

const Wrapper = ({ topicsId }: { topicsId: number }) => {
  const [topic, setTopic] = useState<ITopicBase | null>(null);

  const handleGetData = useCallback(async () => {
    if (topicsId) {
      const topics = await db?.topics.get(topicsId);
      if (topics) setTopic(topics);
    }
  }, [topicsId]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return (
    <AllowExpandProvider topic={topic}>
      <AllowExpand />
    </AllowExpandProvider>
  );
};

export default Wrapper;
