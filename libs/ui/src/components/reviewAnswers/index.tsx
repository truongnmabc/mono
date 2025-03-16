'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { AntTab } from '../tabs';
import { AntTabs } from '../tabs';
import FilterIcon from './filterAnswers';
import { ITableData } from '@ui/container/result/resultContext';
import { ITopicEndTest } from '@ui/container/result';
import TabPanelReview from '@ui/container/result/tabPanelReview';
import { ITopicHomeJson } from '@ui/models/other';
import clsx from 'clsx';

type IProps = {
  tableData: ITableData;
  showFilter?: boolean;
  listTopic?: ITopicEndTest[];
  correctIds?: number[];
  setTableData?: (e: ITableData) => void;
  title?: string;
  type?: 'default' | 'custom';
  topics?: ITopicHomeJson[];
  isMobile?: boolean;
};

const ReviewAnswerResult: React.FC<IProps> = ({
  tableData,
  setTableData,
  listTopic,
  showFilter = true,
  title,
  type,
  correctIds,
  topics,
  isMobile,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      {title && <p className="text-2xl mt-6 font-semibold">{title}</p>}
      <div className="flex pb-2 justify-between items-center gap-4 w-full">
        <AntTabs value={value} onChange={handleChange}>
          <AntTab
            label={
              <LabelReviewAnswerResult
                title="All"
                count={tableData.all.length}
              />
            }
          />
          <AntTab
            label={
              <LabelReviewAnswerResult
                title="Correct"
                count={tableData.correct.length}
              />
            }
          />
          <AntTab
            label={
              <LabelReviewAnswerResult
                title="Incorrect"
                count={tableData.incorrect.length}
              />
            }
          />
        </AntTabs>
        {showFilter && (
          <FilterIcon
            tableData={tableData}
            setTableData={setTableData}
            listTopic={listTopic}
            correctIds={correctIds}
            topics={topics}
          />
        )}
      </div>

      <div
        className={clsx('w-full flex-1  h-full transition-all', {
          'min-h-96': tableData.all.length,
        })}
      >
        {value === 0 && (
          <TabPanelReview
            data={tableData.all}
            type={type}
            isMobile={isMobile}
          />
        )}
        {value === 1 && (
          <TabPanelReview
            data={tableData.correct}
            type={type}
            isMobile={isMobile}
          />
        )}{' '}
        {value === 2 && (
          <TabPanelReview
            data={tableData.incorrect}
            type={type}
            isMobile={isMobile}
          />
        )}
      </div>
    </Fragment>
  );
};

export default ReviewAnswerResult;

const LabelReviewAnswerResult = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => {
  return (
    <span className="flex items-center gap-1">
      {title}{' '}
      <span className="text-[8px] w-6 h-6 flex items-center justify-center text-[#7C6F5B] p-1 rounded-full bg-[#7C6F5B14]">
        {count}
      </span>
    </span>
  );
};
