'use client';

import { db } from '@ui/db';
import { resetState } from '@ui/redux/features/game';
import pauseTestThunk from '@ui/redux/repository/game/pauseAndResumed/pauseTest';
import { syncDown } from '@ui/redux/repository/sync/syncDown';
import { syncUp } from '@ui/redux/repository/sync/syncUp';
import beforeUnLoadThunk, {
  reloadStateThunk,
} from '@ui/redux/repository/utils/reload';
import { useAppDispatch } from '@ui/redux/store';
import { useCallback, useEffect } from 'react';

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
    let syncInterval: NodeJS.Timeout | null = null;

    const handleFocus = () => {
      // if (process.env['NODE_ENV'] === 'development') return;

      // Đảm bảo không có interval nào trước đó đang chạy
      if (!syncInterval) {
        syncInterval = setInterval(() => {
          dispatch(syncUp({}));
        }, 5 * 60 * 1000); // 5 phút
      }
    };

    const handleBlur = () => {
      // if (process.env['NODE_ENV'] === 'development') return;

      // Xóa interval khi cửa sổ mất focus để tiết kiệm tài nguyên
      if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      // if (process.env['NODE_ENV'] === 'development') return;

      if (document.visibilityState === 'hidden') {
        dispatch(syncUp({}));
      } else {
        const app = await db?.passingApp.get(-1);
        dispatch(
          syncDown({
            syncKey: app?.syncKey ?? '',
          })
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
