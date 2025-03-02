import { useMediaQuery } from '@mui/material';
import { IAppInfo } from '@ui/models/app';
import { appConfigState } from '@ui/redux/features/appConfig';
import { selectAppInfo } from '@ui/redux/features/appInfo.reselect';
import { useAppSelector } from '@ui/redux/store';
import FacebookIcon from '@ui/components/icon/FacebookIcon';
import TwitterIcon from '@ui/components/icon/TwitterIcon';
import YoutubeIcon from '@ui/components/icon/YoutubeIcon';
import LazyLoadImage from '@ui/components/images';
import ForwardedLinkBlank from '@ui/components/nextLink';
import { validateEmail } from '@ui/utils/validate';
import RouterApp from '@ui/constants/router.constant';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useRef } from 'react';
import './FooterLandingV4.scss';
import { DmcaIcon } from './info/iconDmca';
import { getContactApp } from '@ui/utils';
import { sendEmailSubscribeApiV4 } from '@ui/services/home';
import { getImageSrc } from '@ui/utils/image';

const FooterLandingV4 = () => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:768px)');
  const emailSupport = 'support@abc-elearning.org';
  const pathname = usePathname();
  const appInfo = useAppSelector(selectAppInfo);
  const _email = useRef<HTMLInputElement>(null);
  const _message = useRef<HTMLInputElement>(null);
  const error_email = useRef<HTMLParagraphElement>(null);
  const error_message = useRef<HTMLParagraphElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  const handleSubmit = async () => {
    let result;
    if (
      _email.current &&
      btn.current &&
      _message.current &&
      error_email.current &&
      error_message.current
    ) {
      try {
        const email = _email.current.value;
        const message = _message.current.value;
        const isValidEmail = validateEmail(email);
        const isValidMessage = message.trim().length > 0;
        if (isValidEmail && isValidMessage) {
          btn.current.innerHTML = 'Sending...';
          btn.current.disabled = true;
          error_email.current.innerHTML = '';
          error_message.current.innerHTML = '';
          result = await sendEmailSubscribeApiV4(
            email.trim(),
            message.trim(),
            appInfo.appName
          );
          _email.current.value = '';
          _message.current.value = '';
        } else {
          error_email.current.innerHTML = isValidEmail
            ? ''
            : 'Please provide a valid email address!';
          error_message.current.innerHTML = isValidMessage
            ? ''
            : 'Type your message please!';
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

  const groupCompanyLegal = () => {
    return (
      <>
        <div className="item-footer cluster-company">
          <div className="title">Company</div>
          <Link href={RouterApp.About} prefetch={false}>
            About Us
          </Link>
          <Link href={RouterApp.Contacts} prefetch={false}>
            Contact Us
          </Link>
        </div>
        <div className="item-footer cluster-legal">
          <div className="title">Legal</div>

          <ForwardedLinkBlank
            href={process.env['NEXT_PUBLIC_API_URL'] + RouterApp.Edit_policy}
          >
            Editorial Policy
          </ForwardedLinkBlank>

          <ForwardedLinkBlank
            href={process.env['NEXT_PUBLIC_API_URL'] + RouterApp.Privacy}
          >
            Privacy Policy
          </ForwardedLinkBlank>

          <ForwardedLinkBlank
            href={
              process.env['NEXT_PUBLIC_API_URL'] + RouterApp.Teams_of_service
            }
          >
            Terms & Conditions
          </ForwardedLinkBlank>

          <ForwardedLinkBlank
            href={process.env['NEXT_PUBLIC_API_URL'] + RouterApp.Refund_policy}
          >
            Refund Policy
          </ForwardedLinkBlank>
        </div>
      </>
    );
  };

  if (
    pathname?.includes('practiceTests') ||
    pathname?.includes('study') ||
    pathname?.includes('final_test') ||
    pathname?.includes('review') ||
    pathname?.includes('result_test') ||
    pathname?.includes('diagnostic_test') ||
    pathname?.includes('custom_test')
  ) {
    return <div className="w-full flex-1 min-h-20 "></div>;
  }

  return (
    <div className="v4-footer-landing-0">
      <div className="v4-footer-landing-container-0 max-w-component-desktop">
        <div className="item-footer  cluster-logo-description">
          <div className="cluster-logo-protected">
            <Link href="/" prefetch={false}>
              <div className={'logo-footer-v4'}>
                <LazyLoadImage
                  classNames="img-logo-footer w-[162px]"
                  src={getImageSrc('logo-light.png')}
                  alt={'logo-' + appInfo.appShortName}
                />
              </div>
            </Link>
            {isMobile && <DmcaIcon />}
          </div>

          <span>
            {appInfo.appShortName == 'cdl'
              ? 'CDL Prep is your ultimate resource to ace your CDL exam with ease, providing simulated practice tests, key insights, and everything you need to hit the road successfully!'
              : appInfo.appShortName == 'asvab'
              ? 'ASVAB Prep provides simulated ASVAB practice tests and insights on the test to help you achieve your military career goals.'
              : appInfo.descriptionSEO}
          </span>

          {!isMobile && <DmcaIcon />}
        </div>

        {isMobile ? (
          <div className="cluster-company-legal"> {groupCompanyLegal()} </div>
        ) : (
          groupCompanyLegal()
        )}
        <div className="item-footer support">
          <div className="title">Support</div>
          <div className="cluster-info-send-mail">
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
            <div className="intro-suport">
              Any questions or feedback? We're here to help!
            </div>
            <div className="v4-input-field v4-border-radius">
              <input
                ref={_email}
                type="email"
                placeholder="Enter your email"
                onChange={() => {
                  if (error_email.current && !!error_email.current.innerHTML)
                    error_email.current.innerHTML = '';
                }}
              />
              <p ref={error_email} className="fieldset"></p>
            </div>
            <div className="v4-input-field v4-border-radius">
              <input
                ref={_message}
                type="text"
                placeholder="Enter your message"
                onChange={() => {
                  if (
                    error_message.current &&
                    !!error_message.current.innerHTML
                  )
                    error_message.current.innerHTML = '';
                }}
              />
              <p ref={error_message} className="fieldset"></p>
            </div>
            <div className="footer-support">
              <button
                ref={btn}
                className="v4-footer-btn-contact-us v4-border-radius v4-button-animtaion"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="v4-footer-landing-container-1">
        <div className="footer-social max-w-component-desktop">
          <WrapperFooter appName={appInfo.appName} />
          <PlatformContactsLogo appInfo={appInfo} />
        </div>
      </div>
    </div>
  );
};
const WrapperFooter = ({ appName }: { appName: string }) => {
  return (
    <span>©2024 {appName} Prep by ABC-Elearning. All rights reserved.</span>
  );
};
const PlatformContactsLogo = ({ appInfo }: { appInfo: IAppInfo }) => {
  const { facebook, twitter, youtube } = getContactApp(appInfo.appShortName);
  const { appConfig } = useAppSelector(appConfigState);
  return (
    <div className="v4-platform-logo-contact-0">
      {facebook && (
        <div>
          <a href={facebook}>
            <FacebookIcon color="#fff" colorApp={appConfig.mainColorBold} />
          </a>
        </div>
      )}
      {twitter && (
        <div>
          <a href={twitter}>
            <TwitterIcon color="#fff" colorApp={appConfig.mainColorBold} />
          </a>
        </div>
      )}
      {youtube && (
        <div>
          <a href={youtube}>
            <YoutubeIcon color="#fff" colorApp={appConfig.mainColorBold} />
          </a>
        </div>
      )}
    </div>
  );
};

export default memo(FooterLandingV4);
