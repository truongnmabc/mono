'use client';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import LazyLoadImage from '@ui/components/images';
import { API_PATH } from '@ui/constants/api.constants';
import RouterApp from '@ui/constants/router.constant';
import { db } from '@ui/db';
import { shouldOpenModalLogin } from '@ui/redux/features/user';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { axiosRequest } from '@ui/services';
import ctx from '@ui/utils/twClass';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { Fragment, useCallback } from 'react';

const handleClearAccount = async () => {
  try {
    // Xóa tất cả dữ liệu trong IndexedDB cùng lúc để tránh blocking
    await Promise.all([
      db?.useActions.clear(),
      db?.userProgress.clear(),
      db?.paymentInfos.clear(),
    ]);

    // Gửi request lấy dữ liệu mới
    const [initTopicResponse, testsResponse] = await Promise.all([
      axiosRequest({ url: API_PATH.SW_TOPIC, method: 'get', base: 'default' }),
      axiosRequest({ url: API_PATH.SW_TESTS, method: 'get', base: 'default' }),
    ]);

    // Lưu dữ liệu mới vào IndexedDB
    if (initTopicResponse.data && testsResponse.data) {
      await Promise.all([
        db?.topics.bulkPut(initTopicResponse.data),
        db?.testQuestions.bulkPut(testsResponse.data),
      ]);
    }
  } catch (error) {
    console.error('Error clearing account:', error);
  }
};

const FN = ({ classNames }: { classNames?: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userInfo = useAppSelector(selectUserInfo);

  const handleNavigate = useCallback(() => {
    setAnchorEl(null);

    router.push(RouterApp.Billing);
  }, [router]);

  const handleLogout = useCallback(() => {
    setAnchorEl(null);
    signOut({
      redirect: false,
    });
    handleClearAccount();
  }, []);

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleOpenModalLogin = useCallback(() => {
    dispatch(shouldOpenModalLogin(true));
  }, [dispatch]);

  if (!userInfo.id) {
    return (
      <div className="hidden sm:block">
        <Button
          onClick={handleOpenModalLogin}
          sx={{
            textTransform: 'capitalize',
            ':hover': {
              backgroundColor: 'transparent',
            },
          }}
          className="gap-3  items-center"
        >
          <div
            className={ctx(
              'text-base font-normal hover-main-color cursor-pointer text-[#21212185]',
              classNames
            )}
          >
            Login
          </div>
        </Button>
      </div>
    );
  }

  return (
    <Fragment>
      <Tooltip title={userInfo?.email || ''} placement="bottom">
        <div className="cursor-pointer" onClick={handleClick}>
          {/* {userInfo.isPro && ( */}
          <LazyLoadImage
            classNames="absolute bottom-full left-2 w-[14px] h-[9px]"
            src="/images/crown.png"
            alt="crown"
            draggable={false}
          />
          {/* )} */}
          <LazyLoadImage
            // classNames={`cursor-pointer flex bg-[#cca68b] rounded-full w-[30px] h-[30px] box-border  ${
            //   isPro
            //     ? "border-2 border-white outline outline-[2px] outline-[#f0bd3a]"
            //     : ""
            // }`}
            classNames="w-8 h-8 "
            imgClassNames="rounded-full"
            src={userInfo?.image || ''}
            alt="avatar"
            draggable={false}
          />
        </div>
      </Tooltip>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <div className="flex gap-2 items-center">
            <LazyLoadImage
              src="/common/header/logout.png"
              classNames="w-6 h-6"
              alt="billing"
            />
            <span>Log Out</span>
          </div>
        </MenuItem>
        <MenuItem onClick={handleNavigate}>
          <div className="flex gap-2 items-center">
            <LazyLoadImage
              src="/common/header/billing.png"
              classNames="w-6 h-6"
              alt="billing"
            />
            <span>Billing History</span>
          </div>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
const LoginHeader = React.memo(FN);
export default LoginHeader;
