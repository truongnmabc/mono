'use client';
import { appInfoState } from '@ui/redux/features/appInfo';
import { useAppSelector } from '@ui/redux/store';
import LazyLoadImage from '@ui/components/images';
import ForwardedLinkBlank from '@ui/components/nextLink';
import { useTheme } from '@ui/hooks/useTheme';

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
