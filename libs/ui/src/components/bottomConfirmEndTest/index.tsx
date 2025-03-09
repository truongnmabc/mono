'use client';
import { selectOpenSubmitTest } from '@ui/redux/features/tests.reselect';
import { useAppSelector } from '@ui/redux/store';
import React from 'react';
const ContentBottomConfirm = dynamic(() => import('./content'), {
  ssr: false,
});
import dynamic from 'next/dynamic';

const BottomConfirmTest = () => {
  const shouldOpenSubmit = useAppSelector(selectOpenSubmitTest);
  if (!shouldOpenSubmit) return null;
  return <ContentBottomConfirm />;
};

export default React.memo(BottomConfirmTest);
