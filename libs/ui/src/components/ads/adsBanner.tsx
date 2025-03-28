import { KEY_CLICK_ADS, MAX_CLICK_ADS_PER_USER } from '@ui/constants';
import ctx from '@ui/utils/twClass';
import React, { useEffect } from 'react';
import BtnRemove from './BtnRemove';
import './index.css';

const countClickAds = () => {
  const clickAds = localStorage.getItem(KEY_CLICK_ADS);
  let totalClick = 0;
  if (clickAds) {
    try {
      totalClick = parseInt(clickAds);
    } catch (error) {
      console.log('🚀 ~ countClickAds ~ error:', error);
    }
  }
  totalClick++;
  localStorage.setItem(KEY_CLICK_ADS, totalClick + '');

  if (totalClick >= MAX_CLICK_ADS_PER_USER) {
    window.location.reload();
  }
};

const AdsBanner = ({
  clientId,
  slotId,
  styles,
  className,
  responsive,
  wrapperClassName,
}: {
  clientId: string;
  slotId: string;
  styles: React.CSSProperties;
  className: string;
  responsive?: boolean;
  wrapperClassName?: string;
}) => {
  useEffect(() => {
    try {
      (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className={wrapperClassName} onClick={countClickAds}>
      <ins
        className={ctx('adsbygoogle', className)}
        style={styles}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-full-width-responsive={responsive}
      />
      <BtnRemove />
    </div>
  );
};

export default AdsBanner;
