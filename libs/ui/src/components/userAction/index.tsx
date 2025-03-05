'use client';
import { selectListQuestion } from '@ui/redux/features/game.reselect';
import getListActionThunk from '@ui/redux/repository/user/getActions';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useEffect } from 'react';

const UserActionListen = () => {
  const listQuestion = useAppSelector(selectListQuestion);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (listQuestion.length > 0) {
      dispatch(
        getListActionThunk({
          ids: listQuestion.map((item) => item.id),
        })
      );
    }
  }, [listQuestion.length, dispatch]);

  return null;
};

export default UserActionListen;
