'use client';
import { useAppSelector } from '@ui/redux/store';
import { selectIsTester } from '@ui/redux/features/user.reselect';

const BtnTets = ({ correct }: { correct: boolean }) => {
  const isTester =
    process.env['NODE_ENV'] === 'development'
      ? true
      : useAppSelector(selectIsTester);
  if (isTester && correct)
    return (
      <div>
        <span>★</span>
      </div>
    );
  return null;
};
export default BtnTets;
