'use client';
import Collapse from '@mui/material/Collapse';
import ItemTestLeft from '@ui/components/gridTests/itemTest';
import { ITestBase } from '@ui/models';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const ListPracticeTest = ({ practice, }: { practice: ITestBase[] }) => {
  const searchParams = useSearchParams();
  const test = searchParams.get('showList');
  return (
    <Collapse in={!!test} timeout="auto" unmountOnExit className="w-full mt-2">
      <div className="w-full flex  flex-col gap-2">
        {practice?.map((test, index) => (
          <ItemTestLeft key={index} index={index} test={test} />
        ))}
      </div>
    </Collapse>
  );
};

export default React.memo(ListPracticeTest);
