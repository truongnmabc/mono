'use client';
import { MtUiButton } from '@ui/components/button';
import { useAppDispatch } from '@ui/redux';
import { syncUp } from '@ui/redux/repository/sync/syncUp';
import React from 'react';

const TestTT = () => {
  const dispatch = useAppDispatch();

  return (
    <MtUiButton
      onClick={() => {
        dispatch(syncUp({ syncKey: 'syncKey' }));
      }}
    >
      TestTT
    </MtUiButton>
  );
};

export default TestTT;
