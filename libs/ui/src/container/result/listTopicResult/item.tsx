import CircleProgress from '@ui/components/circleProgress';
import LazyLoadImage from '@ui/components/images';
import { TypeParam } from '@ui/constants';
import { db } from '@ui/db';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { ITopicEndTest } from '../index';
type IProps = {
  item: ITopicEndTest;
  isMobile: boolean;
};

const ItemListTopicResult: React.FC<IProps> = ({ item, isMobile }) => {
  const progress = Math.floor((item.correct / item.totalQuestion) * 100);
  const router = useRouter();
  const handleImprove = useCallback(async () => {
    const listTopic = await db?.topics
      .where('slug')
      .equals(item.slug || '')
      .sortBy('orderIndex');
    if (listTopic && listTopic.length) {
      const currentTopic = listTopic.find(
        (item) => item.status === 0 && item.type === 3
      );
      if (currentTopic) {
        const params = queryString.stringify({
          type: TypeParam.learn,
          topicId: item.id,
          partId: currentTopic?.id,
        });
        router.push(`${item.slug}?${params}`);
      } else {
        toast.error('All parts have been studied');
      }
    }
  }, [router, item]);

  return (
    <div className="w-full p-4 rounded-xl border border-solid bg-white gap-2 sm:gap-4 flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center justify-between w-full sm:w-fit overflow-hidden flex-1 gap-2">
        <div className="w-8 h-8 sm:h-12 sm:w-12 bg-primary-16 rounded-lg flex items-center justify-center ">
          <LazyLoadImage
            src={item.icon}
            styles={{
              filter:
                'brightness(0) saturate(100%) invert(81%) sepia(50%) saturate(2746%) hue-rotate(336deg) brightness(100%) contrast(98%) ',
            }}
            classNames="w-6  h-6 sm:w-8 sm:h-8 "
          />
        </div>
        <p className="text-base  font-medium flex-1  truncate">{item.name}</p>
        <div
          onClick={handleImprove}
          className=" rounded-[30px] sm:hidden cursor-pointer px-3 py-1 bg-[#E3A65129] font-medium text-xs text-[#E3A651] "
        >
          Improve
        </div>
      </div>
      {isMobile ? (
        <div className=" flex items-center w-full   gap-1">
          <div className="custom-header-progress flex-1">
            <progress className="" value={progress} max={100} />
          </div>
          <div className="text-sm  text-center font-medium w-12">
            {progress} %
          </div>
        </div>
      ) : (
        <CircleProgress
          percentage={progress}
          color="var(--text-color-primary)"
          size={52}
          bgColor="#E3A65129"
          strokeWidth={4}
          textClassName="text-xs"
        />
      )}

      <div
        onClick={handleImprove}
        className=" rounded-[30px] hidden sm:block cursor-pointer px-4 py-2 bg-[#E3A65129] font-medium text-base text-[#E3A651] "
      >
        Improve
      </div>
    </div>
  );
};

export default ItemListTopicResult;
