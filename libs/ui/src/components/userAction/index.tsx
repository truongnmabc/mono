'use client';
import { selectCurrentTopicId } from '@ui/redux/features/game.reselect';
import getListActionThunk from '@ui/redux/repository/user/getActions';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
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
