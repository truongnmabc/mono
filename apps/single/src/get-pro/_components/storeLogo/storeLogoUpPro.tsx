'use client';
import { appInfoState } from '@shared-redux/features/appInfo';
import { useAppSelector } from '@shared-redux/store';
import LazyLoadImage from '@shared-uis/components/images';
import ForwardedLinkBlank from '@shared-uis/components/nextLink';
import { useTheme } from '@shared-uis/hooks/useTheme';

const StoreLogoV4 = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { appInfo } = useAppSelector(appInfoState);
  return (
    <div className="flex gap-4 sm:gap-12 items-center">
      <ForwardedLinkBlank href={appInfo.linkAndroid}>
        <div className="flex items-center flex-col sm:flex-row gap-2">
          <LazyLoadImage
            src={
              '/images/rate' +
              '/ggplay-icon-' +
              (isLight ? 'light' : 'dark') +
              '.png'
            }
            classNames="h-6 sm:h-14"
          />

          <LazyLoadImage
            src={
              '/images/rate' +
              '/ggplay-rate-' +
              (isLight ? 'light' : 'dark') +
              '.png'
            }
            classNames="h-6 sm:h-14"
          />
        </div>
      </ForwardedLinkBlank>

      <div className="flex items-center gap-2">
        <ForwardedLinkBlank href={appInfo.linkAndroid}>
          <div className="flex items-center flex-col sm:flex-row gap-2">
            <LazyLoadImage
              src={
                '/images/rate' +
                '/appstore-icon-' +
                (isLight ? 'light' : 'dark') +
                '.png'
              }
              classNames="h-6 sm:h-14"
            />

            <LazyLoadImage
              src={
                '/images/rate' +
                '/appstore-rate-' +
                (isLight ? 'light' : 'dark') +
                '.png'
              }
              classNames="h-6 sm:h-14"
            />
          </div>
        </ForwardedLinkBlank>
      </div>
    </div>
  );
};

export default StoreLogoV4;
