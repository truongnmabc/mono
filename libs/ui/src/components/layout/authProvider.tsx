'use client';
import { loginHybrid, shouldOpenModalLogin } from '@ui/redux/features/user';
import {
  selectOpenModalLogin,
  selectUserInfo,
} from '@ui/redux/features/user.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { signIn, useSession } from 'next-auth/react';
import Script from 'next/script';
import React, { useEffect } from 'react';
import ModalLogin from '../login';
const GOOGLE_CLIENT_ID = process.env['NEXT_PUBLIC_GOOGLE_ID'];
const APPLE_CLIENT_ID = process.env['NEXT_PUBLIC_APPLE_ID'];
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
interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  callback: (handleCredentialResponse: CredentialResponse) => void;
  login_uri?: string;
  native_callback?: (...args: any[]) => void;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: (...args: any[]) => void;
}

interface CredentialResponse {
  credential?: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'brn_add_session'
    | 'btn_confirm_add_session';
  clientId?: string;
}

interface GsiButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signup_with';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: any;
  height?: string;
  locale?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () =>
    | 'browser_not_supported'
    | 'invalid_client'
    | 'missing_client_id'
    | 'opt_out_or_no_session'
    | 'secure_http_required'
    | 'suppressed_by_user'
    | 'unregistered_origin'
    | 'unknown_reason';
  isSkippedMoment: () => boolean;
  getSkippedReason: () =>
    | 'auto_cancel'
    | 'user_cancel'
    | 'tap_outside'
    | 'issuing_failed';
  isDismissedMoment: () => boolean;
  getDismissedReason: () =>
    | 'credential_returned'
    | 'cancel_called'
    | 'flow_restarted';
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
}

interface RevocationResponse {
  successful: boolean;
  error: string;
}

interface Google {
  accounts: {
    id: {
      initialize: (input: IdConfiguration) => void;
      prompt: (
        momentListener?: (res: PromptMomentNotification) => void
      ) => void;
      renderButton: (
        parent: HTMLElement,
        options: GsiButtonConfiguration
      ) => void;
      disableAutoSelect: () => void;
      storeCredential: (credentials: any, callback: () => void) => void;
      cancel: () => void;
      onGoogleLibraryLoad: () => void;
      revoke: (
        hint: string,
        callback: (done: RevocationResponse) => void
      ) => void;
    };
  };
}

interface CredentialResponse {
  credential?: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'brn_add_session'
    | 'btn_confirm_add_session';
  clientId?: string;
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
  signIn: () => void;
}

interface AppleID {
  auth: AppleIDAuth;
}

declare global {
  interface Window {
    AppleID?: AppleID;
    google?: Google;
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

  const handleClose = () => {
    dispatch(shouldOpenModalLogin(false));
  };

  const handleCredentialResponse = (response: CredentialResponse) => {
    if (response.credential) {
      signIn('token', { redirect: false, token: response.credential });
      handleClose();
    }
  };

  const handleLoginInSuccess = (event: AppleIDSignInSuccessEvent) => {
    if (event?.detail?.authorization?.id_token) {
      signIn('token', {
        redirect: false,
        token: event.detail.authorization.id_token,
      });
      handleClose();
    }
  };

  const handleLoginFailed = (event: AppleIDSignInFailureEvent) => {
    if (event?.detail?.error !== 'popup_closed_by_user') {
      console.error('❌ Apple Login Error:', event.detail.error);
    }
  };

  const handleCheckUserInfo = async (user: IUser) => {
    dispatch(loginHybrid(user));
  };

  // useEffect(() => {
  //   if (status === 'authenticated' && data?.user && !userInfo.id) {
  //     handleCheckUserInfo(data.user);
  //   }

  //   if (status === 'unauthenticated' && !data && userInfo.id) {
  //     dispatch(logoutHybrid());
  //   }
  // }, [status, data, userInfo.id, dispatch]);

  // useEffect(() => {
  //   if (
  //     status === 'unauthenticated' &&
  //     typeof window !== 'undefined' &&
  //     window.google &&
  //     !isMount
  //   ) {
  //     try {
  //       window.google?.accounts?.id?.prompt();
  //       setIsMount(true);
  //     } catch (error) {
  //       console.error('🚀 Google Login Prompt Error:', error);
  //     }
  //   }
  // }, [status, isMount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Khởi tạo Google Login nếu client_id hợp lệ

      console.log('🚀 window.google:', window.google);
      if (window.google && GOOGLE_CLIENT_ID) {
        console.log('🚀 GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);

        window.google?.accounts?.id?.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          cancel_on_tap_outside: true,
        });
      }

      // Khởi tạo Apple Login nếu có APPLE_CLIENT_ID
      if (window.AppleID && APPLE_CLIENT_ID) {
        window.AppleID?.auth?.init({
          clientId: APPLE_CLIENT_ID,
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
      console.error('🚀 Auth Initialization Error:', error);
    }

    return () => {
      document.removeEventListener(
        'AppleIDSignInOnSuccess',
        handleLoginInSuccess
      );
      document.removeEventListener('AppleIDSignInOnFailure', handleLoginFailed);
    };
  }, []);

  return (
    <>
      <ModalLogin open={openModal} setOpen={handleClose} />
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => {
          console.log('🚀 Google Login loaded');
          window.google?.accounts?.id?.initialize({
            client_id: GOOGLE_CLIENT_ID || '',
            callback: handleCredentialResponse,
            cancel_on_tap_outside: true,
          });
        }}
        onReady={() => {
          console.log('🚀 Google Login ready');
        }}
      />
      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        async
        defer
        onLoad={() => {
          console.log('🚀 Apple Login loaded');
          window.AppleID?.auth?.init({
            clientId: APPLE_CLIENT_ID || '',
            scope: 'email',
            redirectURI: window.location.origin,
            usePopup: true,
            responseMode: 'form_post',
          });
        }}
      />
    </>
  );
};

export default AuthProvider;
