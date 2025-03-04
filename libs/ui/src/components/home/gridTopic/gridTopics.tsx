import { Collapse } from '@mui/material';
import TitleCollapse from '@ui/components/allowExpand/titleCollapse';
import LazyLoadImage from '@ui/components/images';
import { TypeParam } from '@ui/constants';
import { IAppInfo } from '@ui/models/app';
import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import PassingHome from '../passing';
// DONE:
export interface ITopicHomeProps {
  id: number;
  icon: string;
  name: string;
  slug?: string;
  topics: ITopicHomeProps[];
}
const GridTopics = ({
  topics,
  appInfo,
  isMobile,
  selectTopic,
}: {
  appInfo: IAppInfo;
  topics: ITopicHomeProps[];
  isMobile: boolean;
  selectTopic?: string;
}) => {
  return (
    <div className="w-full  pt-6 sm:pt-14">
      <h3 className="sm:text-[40px] sm:leading-[60px] font-poppins text-center text-2xl font-bold">
        Practice {appInfo.appName} Test By Topics
      </h3>
      <h3 className="text-sm sm:text-base my-2 sm:my-8 text-[#212121CC] sm:text-[#212121] text-center">
        Our {appInfo?.appName} practice questions feature all 9 {''}
        {appInfo?.appName} test subjects. We recommend practicing questions from
        all subjects to guarantee your success at your local testing location.
        To get started, choose a category from the list below and practice now!
      </h3>
      <PassingHome isMobile={isMobile} />

      <div
        className={clsx(
          'grid  mt-6 sm:mt-10 sm:grid-cols-1 gap-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 md:gap-4'
        )}
      >
        {topics?.map((topic, index) => {
          const isSelect = selectTopic === topic.id.toString();
          return (
            <div
              key={index}
              className={clsx('w-full h-full flex flex-col  sm:block')}
            >
              <Link
                href={
                  isMobile
                    ? isSelect
                      ? '?'
                      : `?selectTopic=${topic.id}`
                    : `${topic.slug}?type=${TypeParam.learn}&topicId=${topic.id}`
                }
                scroll={isMobile ? false : true}
              >
                <div
                  className={ctx(
                    'flex items-center relative p-2 overflow-hidden rounded-md hover:border-primary bg-white max-h-[52px] sm:max-h-[72px] h-full cursor-pointer w-full transition-all  border-solid border border-[#2121211F]'
                  )}
                >
                  <div
                    className={ctx(
                      'rounded-md border-solid bg-primary-16 border-primary transition-all flex items-center rounded-tl-md  justify-center w-[36px] h-[36px] sm:w-[56px] sm:h-[56px]'
                    )}
                  >
                    {topic.icon ? (
                      <LazyLoadImage
                        src={topic.icon}
                        alt={appInfo?.appName + topic.name + 'Practice Test'}
                        classNames="w-6  h-6 sm:w-8 sm:h-8 "
                        priority={false}
                        styles={{
                          filter:
                            'brightness(0) saturate(100%) invert(81%) sepia(50%) saturate(2746%) hue-rotate(336deg) brightness(100%) contrast(98%) ',
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8"></div>
                    )}
                  </div>
                  <h3 className=" pl-3  pr-2 flex-1 truncate font-medium sm:text-lg text-base">
                    {topic.name}
                  </h3>
                </div>
              </Link>
              {isMobile && (
                <div>
                  <Collapse timeout="auto" unmountOnExit in={isSelect}>
                    <div
                      className={ctx('bg-white transition-all ', {
                        'border mt-2 p-2  border-primary rounded-md rounded-br-md border-solid':
                          isSelect,
                      })}
                    >
                      <div className="flex gap-2 flex-col ">
                        {topic?.topics &&
                          topic?.topics?.length > 0 &&
                          topic?.topics?.map(
                            (subTopic: ITopicHomeProps, index: number) => (
                              <TitleCollapse subTopic={subTopic} key={index} />
                            )
                          )}
                      </div>
                    </div>
                  </Collapse>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(GridTopics);
