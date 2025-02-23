'use client';

import { resetState } from '@shared-redux/features/game';
import pauseTestThunk from '@shared-redux/repository/game/pauseAndResumed/pauseTest';
import beforeUnLoadThunk, {
  reloadStateThunk,
} from '@shared-redux/repository/utils/reload';
import { AppDispatch } from '@shared-redux/store';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '@shared-redux/store';

const EventListener = () => {
  const dispatch = useAppDispatch();

  const handlePageReload = useCallback(() => {
    const data = localStorage.getItem('optQuery');
    if (data) {
      dispatch(reloadStateThunk());
      setTimeout(() => {
        if (typeof window !== undefined) {
          localStorage.removeItem('optQuery');
        }
      }, 100);
    }
  }, [dispatch]);

  useEffect(() => {
    handlePageReload();
  }, [handlePageReload]);

  const handleBeforeUnload = useCallback(() => {
    dispatch(pauseTestThunk({}));
    dispatch(beforeUnLoadThunk());
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const handleBackPage = useCallback(async () => {
    await dispatch(pauseTestThunk({}));
    dispatch(resetState());
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('popstate', handleBackPage);

    return () => {
      window.removeEventListener('popstate', handleBackPage);
    };
  }, [handleBackPage]);

  return null;
};

export default EventListener;
