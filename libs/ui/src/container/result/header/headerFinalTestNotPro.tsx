import CloseIcon from '@ui/asset/icon/CloseIcon';
import IconBack from '@ui/components/icon/iconBack';
import LazyLoadImage from '@ui/components/images';
import RouterApp from '@ui/constants/router.constant';
import { useAppDispatch } from '@ui/redux/store';
import { getImageSrc } from '@ui/utils/image';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useResultContext } from '../resultContext';
import DashboardCard from './chartHeader';

const HeaderFinalTestNotPro = ({ isMobile }: { isMobile: boolean }) => {
  const { correct, total, passing } = useResultContext();
  const router = useRouter();
  const back = useCallback(() => router.push(RouterApp.Home), [router]);
  const dispatch = useAppDispatch();
  const imgSrc = getImageSrc('unlock_party_icon.png');

  const handleTryAgain = useCallback(async () => {
    router.replace(RouterApp.Final_test);
  }, [router, dispatch]);

  if (isMobile) {
    return (
      <div className="py-4">
        <div
          className="w-10 h-10 rounded-full cursor-pointer v flex items-center justify-center"
          onClick={back}
        >
          <IconBack />
        </div>
        <div
          className="bg-white mt-4 relative h-[420px]  rounded-2xl"
          style={{
            boxShadow: '0px 0px 8px 0px #21212114',
          }}
        >
          <div className="p-4 ">
            <div className="flex items-center justify-center flex-col gap-4">
              <LazyLoadImage
                src={imgSrc}
                alt="finalTestNotPro"
                classNames="w-10 h-10"
              />
              <p className="text-[#15CB9F] text-center text-3xl font-bold">
                Congratulations !
              </p>
            </div>
            <p className="text-[#21212185] text-base pt-2 text-center font-medium">
              You have completed the first{' '}
              <span className="text-[#212121] text-base font-medium">
                50 questions
              </span>
            </p>
          </div>
          <div className=" absolute -bottom-[56px] left-0 right-0 ">
            <DashboardCard
              correct={correct}
              total={total}
              percent={(correct / total) * 100}
              passing={passing}
              isShowPassing={false}
            />
          </div>
        </div>
        {/* <div className="fixed bottom-0 pb-8 py-4 px-4 left-0 right-0 z-50 bg-theme-dark ">
          <MtUiButton
            className="sm:py-4 sm:max-h-14 text-lg  font-medium rounded-2xl  border-primary"
            block
            type="primary"
            size="large"
            onClick={handleTryAgain}
          >
            Try Again
          </MtUiButton>
        </div> */}
      </div>
    );
  }
  return (
    <div
      className="w-full bg-white rounded-xl sm:p-6 flex justify-between"
      style={{
        boxShadow: ' 0px 4px 12px 0px #21212129',
      }}
    >
      <div
        className="w-10 h-10 rounded-full cursor-pointer bg-[#21212114] flex items-center justify-center"
        onClick={back}
      >
        <CloseIcon />
      </div>
      <div className="relative h-[280px] overflow-hidden flex-1">
        <div className="flex absolute top-0 left-0 right-0 justify-center items-center gap-4">
          <div className="flex h-full gap-4">
            <DashboardCard
              correct={correct}
              total={total}
              percent={(correct / total) * 100}
              passing={passing}
              isShowPassing={false}
            />
            <div className=" border-l-2 px-6 py-8 flex items-center gap-2  flex-col border-solid border-[#2121213D]">
              <div className="flex pt-10 items-center justify-center flex-col gap-4">
                <LazyLoadImage
                  src={imgSrc}
                  alt="finalTestNotPro"
                  classNames="w-16 h-16"
                />
                <p className="text-[#15CB9F] text-3xl font-bold">
                  Congratulations !
                </p>
              </div>
              <p className="text-[#21212185] text-base font-medium">
                You have completed the first{' '}
                <span className="text-[#212121] text-base font-medium">
                  50 questions
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-10 h-10"></div>
    </div>
  );
};

export default HeaderFinalTestNotPro;
