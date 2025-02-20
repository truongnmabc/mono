'use client';
import { selectCurrentTopicId } from '@shared-redux/features/game.reselect';
import getListActionThunk from '@shared-redux/repository/user/getActions';
import { useAppDispatch, useAppSelector } from '@shared-redux/store';
import { useEffect } from 'react';

const UserActionListen = () => {
  const idTopic = useAppSelector(selectCurrentTopicId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (idTopic) {
      dispatch(
        getListActionThunk({
          partId: idTopic,
        })
      );
    }
  }, [idTopic, dispatch]);

  return null;
};

export default UserActionListen;
