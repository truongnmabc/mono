'use client';

import { calculatePassingApp } from '@ui/db/calculate';
import { selectUserInfo, useAppSelector } from '@ui/redux';
import React, { useEffect, useState } from 'react';
import './passing.css';

const PassingProbability = () => {
  const [passingValue, setPassingValue] = useState(0);
  const useInfo = useAppSelector(selectUserInfo);
  useEffect(() => {
    const handleGetData = async () => {
      try {
        const passing = await calculatePassingApp();
        setPassingValue(passing ? Math.round(passing * 10) / 10 : 0);
      } catch (error) {
        console.error('Error in handleGetData:', error);
        setPassingValue(0);
      }
    };
    handleGetData();
  }, [useInfo]);

  return (
    <div className="p-4 rounded-md bg-[#2121210A] dark:bg-black sm:hidden">
      <h3 className="font-semibold truncate text-lg">Passing Probability</h3>
      <div className="mt-3 h-12 w-full custom-progress relative">
        <progress value={passingValue} max={100} className="w-full"></progress>
        <div className="progress-label">{passingValue}%</div>
      </div>
    </div>
  );
};

export default React.memo(PassingProbability);
