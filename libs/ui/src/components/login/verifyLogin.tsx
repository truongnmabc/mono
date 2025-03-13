'use client';

import AppleIcon from '@mui/icons-material/Apple';
import Divider from '@mui/material/Divider';
import { useTheme } from '@ui/hooks';
import { selectAppConfig, selectAppInfo } from '@ui/redux';
import { selectIsTester } from '@ui/redux/features/user.reselect';
import { useAppSelector } from '@ui/redux/store';
import { sendEmailApi } from '@ui/services/home';
import { getImageSrc } from '@ui/utils/image';
import { signIn } from 'next-auth/react';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { MtUiButton } from '../button';
import LazyLoadImage from '../images';
import InputCodeVerify from './inputCodeLogin';
import InputEmailAddress from './inputEmailLogin';

const GOOGLE_ID = process.env['NEXT_PUBLIC_GOOGLE_ID'];

const FN = ({ setOpen }: { setOpen: (e: boolean) => void }) => {
  const [step, setStep] = useState(1);
  const [processing, setProcess] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const btnRef = useRef<HTMLDivElement | null>(null);
  const appInfo = useAppSelector(selectAppInfo);
  const appConfig = useAppSelector(selectAppConfig);
  const isTest = useAppSelector(selectIsTester);

  const verifyEmail = useCallback(async () => {
    setProcess(true);
    try {
      if (email?.length) {
        const data = await sendEmailApi({
          email,
          appName: appInfo?.appName,
        });
        if (data.data === 'Sended email!') {
          setStep(2);
        }
      } else {
        window.alert('Email not empty');
      }
    } catch (err) {
      console.log('🚀 ~ verifyEmail ~ err:', err);
    } finally {
      setProcess(false);
    }
  }, [email, appInfo]);

  const verifyCode = useCallback(async () => {
    const result = await signIn('email', {
      redirect: false,
      email,
      code,
    });
    if (result?.error || !result?.url) {
      window.alert(
        'Verification failed. Please check your code and try again.'
      );
    } else {
      setProcess(false);
      setOpen(false);
    }
  }, [email, code]);

  useLayoutEffect(() => {
    if (btnRef.current && window['google']) {
      window['google'].accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        logo_alignment: 'center',
        type: 'standard',
        text: 'signin_with',
        width: btnRef.current.clientWidth,
        height: '40px',
        locale: 'en-us',
      });
      return () => {
        btnRef.current = null;
      };
    }
    return undefined;
  }, []);

  const loginTester = useCallback(() => {
    signIn('test', {
      redirect: false,
      email,
    });
  }, [isTest, email]);
  const handleLoginApple = useCallback(() => {
    if (window && window['AppleID']) {
      window['AppleID'].auth.signIn();
    }
  }, []);
  const { theme } = useTheme();

  const handleVerify = useCallback(() => {
    if (isTest) return loginTester();
    if (step == 1) return verifyEmail();
    if (step == 2) return verifyCode();
  }, [verifyEmail, verifyCode, step, loginTester, isTest]);
  return (
    <div className="w-full sm:w-1/2 sm:shadow-login flex-1 sm:bg-white rounded-xl flex flex-col justify-between sm:p-6 h-full">
      <div className="flex flex-col  sm:px-6 sm:pb-6 flex-1 gap-6">
        <div className="w-full sm:flex hidden items-center gap-2 justify-center">
          <LazyLoadImage
            src={getImageSrc(
              theme == 'dark' ? 'logo-dark.png' : 'logo-light.png'
            )}
            alt="logoHeader"
            classNames=" max-h-[108px] h-6"
          />
        </div>
        {step == 1 ? (
          <div className="flex-1">
            <div className="flex flex-col gap-4 sm:gap-6">
              <p className="text-center capitalize font-semibold text-2xl">
                Log in to your account
              </p>

              <div ref={btnRef} className="w-full h-10" />
              {appConfig.appleClientId && (
                <MtUiButton
                  className="rounded h-10"
                  onClick={handleLoginApple}
                  block
                >
                  <div className="flex items-center gap-1">
                    <AppleIcon className="w-[18px] " htmlColor="#283544" />
                    <span className="text-xs">Sign in with Apple</span>
                  </div>
                </MtUiButton>
              )}

              {(GOOGLE_ID || appConfig.appleClientId) && (
                <div className="flex w-full items-center justify-between gap-1">
                  <Divider className="flex-1" />
                  <span className="text-sm text-[#c4c4c4]">or</span>
                  <Divider className="flex-1" />
                </div>
              )}
              <div>
                <p className="pb-2">Email Address</p>
                <InputEmailAddress
                  onEnter={handleVerify}
                  onChangeValue={setEmail}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col  gap-8">
            <p className="text-2xl text-center px-6  font-semibold">
              Enter your verification code
            </p>
            <p className="text-sm text-center px-6 text-[#949494] ">
              Please check your inbox for the verification code sent to {email}
            </p>
            <div className="w-full">
              <p className="text-sm pb-4">Your code</p>
              <InputCodeVerify onChangeValue={setCode} onEnter={handleVerify} />
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 sm:hidden block">
        <LazyLoadImage
          classNames="h-full aspect-video flex-1"
          src={getImageSrc('login_banner.png')}
          alt="logoHeader"
        />
      </div>
      <MtUiButton
        loading={processing}
        disabled={step == 1 ? email?.length === 0 : code?.length === 0}
        onClick={handleVerify}
        type="primary"
        size="large"
        className="mb-4 sm:h-12 text-base sm:mb-0 rounded-xl"
      >
        Verify
      </MtUiButton>
    </div>
  );
};
const VerifyLogin = React.memo(FN);
export default VerifyLogin;
