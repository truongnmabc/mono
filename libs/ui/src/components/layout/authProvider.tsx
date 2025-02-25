'use client';
import {
  loginHybrid,
  logoutHybrid,
  shouldOpenModalLogin,
} from '@ui/redux/features/user';
import {
  selectOpenModalLogin,
  selectUserInfo,
} from '@ui/redux/features/user.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { signIn, useSession } from 'next-auth/react';
import React, { useCallback, useEffect } from 'react';
import ModalLogin from '../login';
const GOOGLE_CLIENT_ID = process.env['NEXT_PUBLIC_GOOGLE_ID'];

type IUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

interface AppleIDSignInSuccessEvent extends Event {
  detail: {
    authorization: {
      code: string; // Mã ủy quyền
      id_token: string; // ID token (JWT)
      state?: string; // Giá trị state nếu được gửi kèm
    };
    user?: {
      email?: string;
      name?: {
        firstName: string;
        lastName: string;
      };
    };
  };
}
interface AppleIDSignInFailureEvent extends Event {
  detail: {
    error: string; // Mô tả lỗi, ví dụ: "popup_closed_by_user"
  };
}

interface AppleIDAuth {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    usePopup: boolean;
    responseMode: 'query' | 'fragment' | 'form_post';
    state?: string;
    nonce?: string;
  }) => void;
}

interface AppleID {
  auth: AppleIDAuth;
}

declare global {
  interface Window {
    AppleID?: AppleID;
  }
  interface DocumentEventMap {
    AppleIDSignInOnSuccess: AppleIDSignInSuccessEvent;
    AppleIDSignInOnFailure: AppleIDSignInFailureEvent;
  }
}
const AuthProvider = () => {
  const { status, data } = useSession();
  const openModal = useAppSelector(selectOpenModalLogin);
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const [isMount, setIsMount] = React.useState(false);

  const handleClose = useCallback(() => {
    dispatch(shouldOpenModalLogin(false));
  }, [dispatch]);

  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      if (response.credential) {
        signIn('token', {
          redirect: false,
          token: response.credential,
        });
        handleClose();
      }
    },
    [handleClose]
  );

  const handleLoginInSuccess = useCallback(
    async (event: AppleIDSignInSuccessEvent) => {
      if (event?.detail?.authorization?.id_token) {
        signIn('token', {
          redirect: false,
          token: event.detail.authorization.id_token,
        });
        handleClose();
      }
    },
    [handleClose]
  );
  const handleLoginFailed = useCallback(
    async (event: AppleIDSignInFailureEvent) => {
      try {
        if (event?.detail?.error != 'popup_closed_by_user') {
          // await sendErrorToDiscord(event?.detail?.error, "Login Apple Error");
        }
      } catch (error) {
        console.log('error handle', error);
      }
    },
    []
  );

  useEffect(() => {
    if (
      status === 'unauthenticated' &&
      typeof window !== 'undefined' &&
      window?.google &&
      !isMount
    ) {
      const timeOut = setTimeout(() => {
        try {
          window.google?.accounts?.id?.prompt((e) => {
            console.log('first prompt', e);
          });
          setIsMount(true);
        } catch (error) {
          console.log('🚀 ~ useEffect ~ error', error);
        }
      }, 1000);

      return () => {
        clearTimeout(timeOut);
      };
    }
    return undefined;
  }, [status, isMount]);

  const handleCheckUserInfo = useCallback(
    async (user: IUser) => {
      dispatch(loginHybrid(user));
    },
    [dispatch]
  );

  useEffect(() => {
    if (status === 'authenticated' && data && !userInfo.id) {
      if (data.user) handleCheckUserInfo(data.user);
    }

    if (status === 'unauthenticated' && !data && userInfo.id) {
      dispatch(logoutHybrid());
    }
  }, [status, data, userInfo, handleCheckUserInfo, dispatch]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window?.google && GOOGLE_CLIENT_ID) {
        window.google?.accounts?.id?.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (res) => handleCredentialResponse(res),
          cancel_on_tap_outside: false,
        });
      }

      if (
        typeof window !== 'undefined' &&
        window?.AppleID &&
        process.env['NEXT_PUBLIC_APPLE_ID']
      ) {
        console.log('🚀 ~ useEffect ~ AppleID:', window?.AppleID);
        window.AppleID?.auth?.init({
          clientId: process.env['NEXT_PUBLIC_APPLE_ID'],
          scope: 'email',
          redirectURI: window.location.origin,
          usePopup: true,
          responseMode: 'form_post',
        });
        document.addEventListener(
          'AppleIDSignInOnSuccess',
          handleLoginInSuccess
        );
        document.addEventListener('AppleIDSignInOnFailure', handleLoginFailed);
      }
    } catch (error) {
      console.log('🚀 ~ useLayoutEffect ~ error', error);
    }
  }, [handleCredentialResponse, handleLoginInSuccess, handleLoginFailed]);

  return <ModalLogin open={openModal} setOpen={handleClose} />;
};

export default AuthProvider;
