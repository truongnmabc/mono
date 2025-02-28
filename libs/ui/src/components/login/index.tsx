'use client';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import BannerModalLogin from './bannerModalLogin';
import './styles.css';
import VerifyLogin from './verifyLogin';
export const FN = ({
  open,
  setOpen,
  allowClose = true,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  allowClose?: boolean;
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (allowClose) setOpen(false);
      }}
      className="v4-login-dialog"
    >
      <div className="flex flex-col p-4 sm:p-6 sm:flex-row w-full h-full overflow-hidden  bg-[#E9F2FF] dark:bg-black">
        <BannerModalLogin />
        <VerifyLogin setOpen={setOpen} />
      </div>
    </Dialog>
  );
};

const ModalLogin = React.memo(FN);

export default ModalLogin;
