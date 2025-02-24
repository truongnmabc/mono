'use client';
import { Dialog } from '@mui/material';
import { ICurrentGame } from '@ui/models/game';
import { selectCurrentGame } from '@ui/redux/features/game.reselect';
import { selectListActions } from '@ui/redux/features/user.reselect';
import userActionsThunk from '@ui/redux/repository/user/actions';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import IconBookmark from '@ui/components/icon/iconBookmark';
import IconDislike from '@ui/components/icon/iconDislike';
import IconLike from '@ui/components/icon/iconLike';
import { useIsMobile } from '@ui/hooks/useIsMobile';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReportMistake from '../reportMistake';
const Sheet = dynamic(() => import('@ui/components/sheet'), {
  ssr: false,
});
const Reaction = ({ item }: { item?: ICurrentGame }) => {
  const currentGame = useAppSelector(selectCurrentGame);
  const listActions = useAppSelector(selectListActions);
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState({
    like: false,
    dislike: false,
    save: false,
  });

  useEffect(() => {
    if (item?.id || currentGame?.id || listActions.length) {
      const question = listActions?.find(
        (a) => a.questionId === item?.id || a.questionId === currentGame.id
      );
      if (question) {
        setStatus({
          like: question.actions?.includes('like'),
          dislike: question.actions?.includes('dislike'),
          save: question.actions?.includes('save'),
        });
      } else {
        setStatus({
          like: false,
          dislike: false,
          save: false,
        });
      }
    }
  }, [item, currentGame, listActions]);

  const saveAction = useCallback(() => {
    if (!status.save) {
      toast.success(' Added To Saved List!');
    } else {
      toast.info(' Removed From Saved List!');
    }
    dispatch(
      userActionsThunk({
        status: 'save',
        questionId: item?.id || currentGame.id,
        partId: item?.parentId || currentGame.parentId,
      })
    );
  }, [dispatch, currentGame?.id, currentGame?.parentId, item, status.save]);

  const likeAction = useCallback(() => {
    if (!status.like) {
      toast.success('You find this question useful!');
    }
    dispatch(
      userActionsThunk({
        status: 'like',
        questionId: item?.id || currentGame.id,
        partId: item?.parentId || currentGame.parentId,
      })
    );
  }, [dispatch, currentGame?.id, currentGame?.parentId, item, status.like]);

  const dislikeAction = () => setOpenModal(true);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div
        className={clsx('cursor-pointer', {
          'pointer-events-none opacity-80': status.dislike,
        })}
        onClick={likeAction}
      >
        <IconLike
          color={
            status.like
              ? 'var(--color-primary)'
              : status.dislike
              ? 'rgba(124, 111, 91, 0.5)'
              : '#7C6F5B'
          }
        />
      </div>
      <div
        className={clsx('cursor-pointer', {
          'pointer-events-none opacity-80': status.like,
        })}
        onClick={dislikeAction}
      >
        <IconDislike
          color={
            status.dislike
              ? 'var(--color-primary)'
              : status.like
              ? 'rgba(124, 111, 91, 0.5)'
              : '#7C6F5B'
          }
        />
      </div>
      <div className="cursor-pointer" onClick={saveAction}>
        <IconBookmark
          color={status.save ? 'var(--color-primary)' : '#7C6F5B'}
        />
      </div>
      {isMobile ? (
        <Sheet
          visible={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          className="custom-sheet-handler"
        >
          <ReportMistake
            onClose={() => {
              setOpenModal(false);
            }}
          />
        </Sheet>
      ) : (
        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
        >
          <ReportMistake
            onClose={() => {
              setOpenModal(false);
            }}
          />
        </Dialog>
      )}
    </div>
  );
};

export default React.memo(Reaction);
