'use client';
import { setIsTester } from '@ui/redux/features/user';
import { useAppDispatch } from '@ui/redux/store';
import { useEffect, useState } from 'react';
import { ModalTestMode } from './modalTestMode';

const TestMode = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(
    process.env['NODE_ENV'] === 'development'
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (clickCount >= 3) {
      console.log('clickCount', clickCount);
      setShowModal(true);
      dispatch(setIsTester(true));
      setClickCount(0);
    }
  }, [clickCount]);

  const handleClick = () => {
    if (!showModal) {
      setClickCount((prev) => prev + 1);
      setTimeout(() => setClickCount(0), 1000); // Reset nếu không click nhanh trong 1s
    } else {
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        className="fixed z-50 bottom-4 right-4 cursor-pointer"
        onClick={handleClick}
      >
        <span className="text-sm text-[#ccc] font-medium">
          Version 1.0.{clickCount}
        </span>
      </div>

      {showModal && <ModalTestMode />}
    </>
  );
};

export default TestMode;
