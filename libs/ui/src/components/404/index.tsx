'use client';

import { useIsMobile } from '@ui/hooks';
import { getImageSrc } from '@ui/utils/image';
import { useRouter } from 'next/navigation';
import ImagesRender from './imagesRender';
import './index.css';

const Page404Container = () => {
  const router = useRouter();
  const onBack = () => router.back();
  const isMobile = useIsMobile();
  const imgSrcNumber404 = getImageSrc('404_number404.png');
  const imgSrcNumber404Mobile = getImageSrc('404_number404_mobile.png');
  const imgSrcSoldier_mobile = getImageSrc('404_soldier_mobile.png');
  const imgSrcSoldier = getImageSrc('404_soldier.png');
  const backgroundImage = getImageSrc('404_background.png');
  const backgroundImageMobile = getImageSrc('404_background_mobile.png');
  return (
    <div
      className="page-404-container "
      style={{
        backgroundImage: `url(${
          isMobile ? backgroundImageMobile : backgroundImage
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="main-page">
        <ImagesRender
          src={isMobile ? imgSrcNumber404Mobile : imgSrcNumber404}
          size={{
            width: 499,
            height: 277,
          }}
          mobileSize={{
            width: 287,
            height: 131,
          }}
          isMobile={isMobile}
          className="number404"
        />

        <div className="page-not-found-text">Oops! Page not found.</div>
        <div className="sorry-text">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </div>
        <div onClick={onBack} className="button-back">
          Back to Home
        </div>
      </div>
      <ImagesRender
        src={isMobile ? imgSrcSoldier_mobile : imgSrcSoldier}
        className="soldier"
        size={{
          width: 508,
          height: 657,
        }}
        isMobile={isMobile}
        mobileSize={{
          width: 192,
          height: 246,
        }}
      />
    </div>
  );
};

export default Page404Container;
