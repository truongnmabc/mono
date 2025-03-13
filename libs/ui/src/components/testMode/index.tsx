'use client';
import { Modal } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import XIcon from '@ui/asset/icon/XIcon';
import { db } from '@ui/db';
import { selectUserInfo } from '@ui/redux';
import { clearIsPro, setIsTester, shouldIsPro } from '@ui/redux/features/user';
import { syncDown } from '@ui/redux/repository/sync/syncDown';
import { syncUp } from '@ui/redux/repository/sync/syncUp';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useClearIsProServer, useSetIsProServer } from '@ui/services/actions';
import { Fragment, useEffect, useState } from 'react';
import { MtUiButton } from '../button';

const TestMode = ({ isScrollRef }: { isScrollRef: boolean }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(
    process.env['NODE_ENV'] === 'development'
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (clickCount >= 3) {
      console.log('clickCount', clickCount);
      setShowModal(true);
      setClickCount(0); // Reset lại số lần click sau khi mở modal
      sessionStorage.setItem('isTester', 'true');
    }
  }, [clickCount]);

  const handleClick = () => {
    if (!showModal) {
      setClickCount((prev) => prev + 1);
      setTimeout(() => setClickCount(0), 1000); // Reset nếu không click nhanh trong 1s
    } else {
      setShowModal(false);
      dispatch(setIsTester(true));
    }
  };

  return (
    <>
      {isScrollRef && (
        <div
          className="fixed z-50 bottom-4 right-4 cursor-pointer"
          onClick={handleClick}
        >
          <span className="text-sm text-[#ccc] font-medium">Version 1.0.0</span>
        </div>
      )}

      {showModal && <ModalTestMode />}
    </>
  );
};

export default TestMode;

const ModalTestMode = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const modes = [
    { label: 'All Correct', value: 'correct' },
    { label: 'All Incorrect', value: 'incorrect' },
    { label: 'Random', value: 'random' },
    { label: 'Custom', value: 'custom' },
  ];
  const user = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const handleGetPro = async () => {
    dispatch(shouldIsPro());
    useSetIsProServer();
  };

  const handleClearPro = async () => {
    useClearIsProServer();
    dispatch(clearIsPro());
  };

  const handleSyncUp = async () => {
    dispatch(syncUp({}));
  };
  const handleSyncDown = async () => {
    const app = await db?.passingApp.get(-1);
    dispatch(
      syncDown({
        syncKey: app?.syncKey || '',
      })
    );
  };
  return (
    <Fragment>
      {/* Button mở Modal */}
      <div
        className="fixed z-50 bottom-32 bg-white rounded-full p-2 right-8 cursor-pointer shadow-md"
        onClick={() => setShowModal(true)}
      >
        <XIcon />
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl text-center font-semibold">Test Settings</h2>
          <p className="text-center text-sm text-gray-600">
            Select a test mode to start
          </p>

          {/* List Options */}
          <div className="flex flex-col">
            {modes.map((mode) => (
              <label
                key={mode.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100  rounded transition"
              >
                <Checkbox
                  checked={selectedMode === mode.value}
                  onChange={() => setSelectedMode(mode.value)}
                />
                <span className="text-base">{mode.label}</span>
              </label>
            ))}
          </div>
          <MtUiButton onClick={handleSyncUp}>Sync Up</MtUiButton>
          <MtUiButton onClick={handleSyncDown}>Sync Down</MtUiButton>
          <MtUiButton
            onClick={handleGetPro}
            type={user.isPro ? 'primary' : 'default'}
          >
            {' '}
            Is Pro
          </MtUiButton>

          <MtUiButton
            onClick={handleClearPro}
            type={!user.isPro ? 'primary' : 'default'}
          >
            {' '}
            Clear Pro
          </MtUiButton>

          {/* Buttons */}
          <div className="flex items-center w-full justify-center gap-3 mt-4">
            <MtUiButton block onClick={() => setShowModal(false)}>
              Close
            </MtUiButton>
            <MtUiButton
              block
              type="primary"
              disabled={!selectedMode}
              onClick={() => {
                setShowModal(false);
                console.log('🚀 ~ ModalTestMode ~ selectedMode:', selectedMode);
              }}
            >
              Start
            </MtUiButton>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
