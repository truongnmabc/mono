'use client';

import { IAppInfo } from '@ui/models';
import DescriptionComponent from './description';
import './index.scss';

import RouterApp from '@ui/constants/router.constant';
import Image from 'next/image';
import Link from 'next/link';

const HeaderComponent = ({
  appInfo,
  isMobile,
}: {
  appInfo: IAppInfo;
  isMobile: boolean;
}) => {
  if (!isMobile) {
    return (
      <div className="about-header-component">
        <div className="about-header-container max-w-component-desktop">
          <div className="info">
            <div className="title">About Us</div>
            <DescriptionComponent isMobile={isMobile} />
            <div className="stats-container">
              <Link href={RouterApp.Contacts} prefetch={false}>
                <div className="contact-button">Contacts</div>
              </Link>
              <div className="stats-area">
                <div className="stats">
                  <div className="number">5+</div>
                  <div className="label">Years Establishment</div>
                </div>
                <div className="line"></div>
                <div className="stats">
                  <div className="number">1.375M+</div>
                  <div className="label">Users</div>
                </div>
                <div className="line"></div>
                <div className="stats">
                  <div className="number">96%</div>
                  <div className="label">Passing Rate</div>
                </div>
              </div>
            </div>
          </div>
          <div className="soldier">
            <Image
              src="/images/about/soldier.png"
              alt="soldier"
              draggable="false"
              layout="fill"
              priority
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="about-header-component-mobile">
      <Image
        src={'/images/about/mobile/background-header.png'}
        alt="background"
        draggable="false"
        layout="fill"
        priority
      />
      <div className="about-header-container">
        <div className="title">About Us</div>
        <DescriptionComponent isMobile={isMobile} />
        <Link href={RouterApp.Contacts} prefetch={false}>
          <div className="contact-button">Contacts</div>
        </Link>
        <div className="stats-container">
          <div className="stats-area">
            <div className="stats">
              <div className="number">5+</div>
              <div className="label">Years Establishment</div>
            </div>
            <div className="stats">
              <div className="number">1.375M+</div>
              <div className="label">Users</div>
            </div>
            <div className="stats">
              <div className="number">96%</div>
              <div className="label">Passing Rate</div>
            </div>
          </div>
          <div className="soldier">
            <Image
              src="/images/about/mobile/soldier.png"
              alt="soldier"
              draggable="false"
              layout="fill"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
