import CloseIcon from '@ui/asset/icon/CloseIcon';
import { MtUiButton } from '@ui/components/button';
import CircleProgress from '@ui/components/circleProgress';
import MyContainer from '@ui/components/container';
import IconBack from '@ui/components/icon/iconBack';
import LazyLoadImage from '@ui/components/images';
import RouterApp from '@ui/constants/router.constant';
import { getImageSrc } from '@ui/utils/image';
import clsx from 'clsx';
import { motion, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const imgSrc = getImageSrc('result_end_diagnostic.png');
type IProps = {
  handleTryAgain: () => void;
  percentage: number;
  isMobile: boolean;
};
const HeaderResultDiagnostic = ({
  handleTryAgain,
  percentage,
  isMobile,
}: IProps) => {
  return (
    <MyContainer className="sm:py-8  flex flex-col sm:flex-row gap-8 ">
      <div className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col sm:flex-row  justify-between">
        <Link href={RouterApp.Home}>
          <div className="w-10 h-10 hidden sm:flex rounded-full cursor-pointer bg-[#21212114]  items-center justify-center">
            <CloseIcon />
          </div>
        </Link>
        <Link href={RouterApp.Home}>
          <div className=" sm:hidden ">
            <IconBack />
          </div>
        </Link>

        <div className=" flex w-full flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <div className="p-2 rounded-full bg-[#7C6F5B1F]">
            <CircleProgress
              percentage={percentage}
              color="#7C6F5B"
              size={isMobile ? 220 : 260}
              bgColor="#7C6F5B3D"
              strokeWidth={16}
              customText={
                <div className=" absolute inset-0 z-10 flex items-center flex-col gap-2 justify-center">
                  <LazyLoadImage
                    src={imgSrc}
                    alt="icon_pass_result_test"
                    classNames="w-10 h-fit"
                  />
                  <p className="text-[#7C6F5B] text-xs sm:text-sm font-normal">
                    Your result is
                  </p>

                  <AnimationNumber percentage={percentage} />
                </div>
              }
            />
          </div>
          <div className="sm:p-3 text-center sm:text-start h-full flex flex-col gap-2 ">
            <p className="text-sm sm:text-lg font-normal">Date Of Test :</p>
            <p className=" text-base sm:text-2xl font-semibold">
              {formatDate()}
            </p>
            <p className="text-sm sm:text-lg font-normal">Your Level :</p>
            <p className="text-base sm:text-2xl font-semibold capitalize text-primary">
              {percentage < 30
                ? 'beginner'
                : percentage > 60
                ? 'advanced'
                : 'Intermediate'}
            </p>

            <div
              className={clsx('w-full flex items-center ', {
                'fixed bottom-0 left-0 right-0 bg-theme-white pb-4 pt-2 h-fit px-4 z-50':
                  isMobile,
              })}
            >
              <MtUiButton
                className="sm:py-4 sm:max-h-14 text-lg font-medium rounded-2xl text-primary border-primary"
                block
                type="primary"
                size="large"
                onClick={handleTryAgain}
              >
                Try Again
              </MtUiButton>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </MyContainer>
  );
};

export default HeaderResultDiagnostic;

const formatDate = (): string => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const AnimationNumber = ({ percentage }: { percentage: number }) => {
  const [value, setValue] = useState(0);
  const stringCount = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 1000,
  });
  stringCount.on('change', (e) => setValue(Math.round(e)));

  useEffect(() => {
    stringCount.set(percentage);
  }, [percentage]);
  return (
    <motion.p className="text-[#7C6F5B] text-base sm:text-3xl font-semibold">
      {value} %
    </motion.p>
  );
};
