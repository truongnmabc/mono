'use client';
import { useMediaQuery } from '@mui/material';
import LazyLoadImage from '@ui/components/images';
import { IAppConfigData, IAppInfo } from '@ui/models/app';
import { sendEmailSubscribeApiV4 } from '@ui/services/home';
import { getContactApp, validateEmail } from '@ui/utils';
import { useRouter } from 'next/navigation';
import { Fragment, useRef, useState } from 'react';
import { SocialsIcon } from '../social';
import './style.scss';

const TopContactAsvab = ({
  appInfo,
  appConfig,
}: {
  appInfo: IAppInfo;
  appConfig: IAppConfigData;
}) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const router = useRouter();
  const layoutSendMail = () => {
    return (
      <div className="cluster-send-mail-asvab">
        <div className="form-send-mail">
          <div className="title">Contact Us</div>
          <div className="description">
            Any questions, comments or feedback? We’re here to help!
          </div>

          <div className="input-mail">
            <p>Email</p>
            <div className="group-input-noti">
              <input
                type="text"
                name="email"
                value={valueSendMail.email}
                onChange={onChangeEmail}
                placeholder="Enter your email"
              />
              <div className={'noti ' + (!checkEmailExist ? 'check' : '')}>
                Please provide a valid email address!
              </div>
            </div>
          </div>
          <div className="input-message">
            <p>Message</p>
            <div className="group-textarea-noti">
              <textarea
                className="message-send-mail"
                id="message-send-mail"
                placeholder="Enter your message"
                value={valueSendMail.message}
                onChange={onChangeMessage}
              ></textarea>
              <div className={'noti ' + (!checkMessageExist ? 'check' : '')}>
                Please type your message!
              </div>
            </div>
          </div>

          <button ref={btn} onClick={() => handleSubmit()}>
            Send
          </button>
          {isMobile && (
            <>
              <div className="contact-information">Contact Information</div>
              <div className="intro">We’re always happy to hear from you!</div>
              {emailSupport && (
                <div
                  className="cluster-email"
                  onClick={() => {
                    router.push(`mailto:${emailSupport}`);
                  }}
                >
                  <LazyLoadImage src="/images/contacts/sms.png" alt="" />

                  <div className="text-info">{emailSupport}</div>
                </div>
              )}
              <SocialsIcon appConfig={appConfig} appName={appInfo.appName} />
            </>
          )}
        </div>
      </div>
    );
  };
  const btn = useRef<HTMLButtonElement>(null);
  const [valueSendMail, setValueSendMail] = useState({
    email: '',
    message: '',
  });
  const [checkMessageExist, setCheckMessageExist] = useState(true);
  const [checkEmailExist, setCheckEmailExist] = useState(true);
  const { email: emailSupport } = getContactApp(appInfo.appShortName);

  const onChangeEmail = (e: { target: { value: string } }) => {
    if (e.target.value != '') {
      setCheckEmailExist(true);
    } else {
      setCheckEmailExist(false);
    }
    setValueSendMail({
      ...valueSendMail,
      email: e.target.value,
    });
  };
  const onChangeMessage = (e: { target: { value: string } }) => {
    if (e.target.value != '') {
      setCheckMessageExist(true);
    } else {
      setCheckMessageExist(false);
    }
    setValueSendMail({
      ...valueSendMail,
      message: e.target.value,
    });
  };
  const handleSubmit = async () => {
    if (btn.current) {
      let result;
      try {
        const email = valueSendMail.email;
        const message = valueSendMail.message;
        const isValidEmail = validateEmail(valueSendMail.email);
        const isValidMessage = message.trim().length > 0;
        if (!isValidMessage) {
          setCheckMessageExist(false);
        }
        if (!isValidEmail || !email) {
          setCheckEmailExist(false);
        }
        if (isValidEmail && isValidMessage) {
          btn.current.innerHTML = 'Sending...';
          btn.current.disabled = true;

          result = await sendEmailSubscribeApiV4(
            email.trim(),
            message.trim(),
            appInfo.appName
          );
        }
      } catch (error) {
        console.log('footer send mail error', error);
      }
      if (result) {
        btn.current.innerHTML = 'Sent';
        setTimeout(() => {
          if (btn.current) {
            btn.current.disabled = false;
            btn.current.innerHTML = 'Send';
          }
        }, 2000);
      }
    }
  };
  return (
    <Fragment>
      {!isMobile && (
        <div className="in-form-asvab max-w-component-desktop">
          <div className="left-form">
            <LazyLoadImage
              classNames="img-back"
              src="/images/contacts/asvab/background-soldier.png"
              alt=""
            />
            <div className="cluster-img-info">
              <div className="title">Contact Information</div>
              <div className="intro">We’re always happy to hear from you!</div>
              {emailSupport && (
                <div
                  className="cluster-email"
                  onClick={() => {
                    router.push(`mailto:${emailSupport}`);
                  }}
                >
                  <LazyLoadImage
                    src="/images/contacts/sms.png"
                    alt=""
                    classNames="w-6 h-6"
                  />

                  <div className="text-info flex-1">{emailSupport}</div>
                </div>
              )}
              <div
                className="cluster-location"
                onClick={() => {
                  router.push('/');
                }}
              >
                <LazyLoadImage
                  src="/images/contacts/location.png"
                  alt=""
                  classNames="w-6 h-6"
                />
                <div className="text-info flex-1">
                  209 S Rosemont Ave, Dallas, TX 75208
                </div>
              </div>

              <SocialsIcon appConfig={appConfig} appName={appInfo.appName} />
            </div>
          </div>

          {layoutSendMail()}
        </div>
      )}
      {isMobile && layoutSendMail()}
    </Fragment>
  );
};

export default TopContactAsvab;
