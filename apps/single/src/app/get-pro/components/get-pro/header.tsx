import { getImageSrc } from '@ui/utils/image';
import clsx from 'clsx';
import Image from 'next/image';
const list = [
  {
    title: 'Unlock Explanations for 1000+ Questions',
  },
  {
    title: 'Customize your own tests',
  },
  {
    title: 'Remove ads',
  },
];

const list2 = [
  {
    title: 'Use Dark mode',
  },
  {
    title: 'Sync Across Devices',
  },
];

export default function HeaderGetPro({
  appName,
  isMobile,
}: {
  appName: string;
  isMobile: boolean;
}) {
  const iconSrc = getImageSrc('get-pro-check-icon.png');
  const bgSrc = getImageSrc('get-pro-bg.png');
  return (
    <div
      className="w-full bg-no-repeat bg-right  pb-6 sm:pb-14"
      style={{
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: isMobile ? 'cover' : '100% 100%',
        backgroundPosition: isMobile ? 'right 48px' : 'right',
      }}
    >
      <div className="pt-6 sm:pb-6 pb-4 flex items-center justify-start sm:justify-center">
        <h1 className=" text-start px-6 sm:text-center font-poppins max-w-[327px] sm:max-w-none  text-2xl sm:text-[52px] leading-normal ">
          <span className="font-semibold">Pass for the first time With </span>
          <span className="font-bold  text-2xl sm:text-[56px] text-primary">
            {appName}
          </span>
          <span className="font-bold relative text-2xl sm:text-[56px] text-primary">
            {' '}
            Pro
            <div
              className={clsx('absolute ', {
                'right-[2px] -top-[2px] w-3 h-3': isMobile,
                'right-[6px] top-0 w-[25px] h-[19px]': !isMobile,
              })}
            >
              <Ic />
            </div>
          </span>
          <span className="font-semibold capitalize text-2xl sm:text-[52px] ">
            {' '}
            Plan
          </span>
        </h1>
      </div>

      <div className="flex mx-6 sm:mx-auto flex-col sm:flex-row flex-wrap sm:max-w-[700px] gap-x-12 gap-y-[14px] sm:gap-y-4 justify-center">
        <div className="flex items-center gap-[14px] sm:gap-4 flex-col">
          {list.map((item, index) => (
            <div
              key={index}
              className="flex items-center self-stretch gap-3 stre "
            >
              <Image
                src={iconSrc}
                alt={item.title}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-xs sm:text-lg font-medium">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[14px] sm:gap-4 flex-col">
          {list2.map((item, index) => (
            <div
              key={index}
              className="flex items-center self-stretch gap-3 stre "
            >
              <Image
                src={iconSrc}
                alt={item.title}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-xs sm:text-lg font-medium">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Ic = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 25 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1535_10686)">
        <path
          d="M21.4178 5.609L16.0641 9.85194L12.5766 3.34887C12.3653 2.95549 11.7262 2.95549 11.5148 3.34887L8.02744 9.85194L2.67252 5.609C2.45992 5.43919 2.16396 5.4343 1.94532 5.59434C1.72668 5.75438 1.63971 6.04026 1.73151 6.29681L5.51728 16.9011C5.60305 17.143 5.83135 17.3043 6.08503 17.3043H18.0028C18.2565 17.3043 18.4848 17.143 18.5706 16.9011L22.3564 6.29681C22.4482 6.04026 22.36 5.75438 22.1425 5.59434C21.9275 5.4343 21.6304 5.43919 21.4178 5.609ZM17.5801 16.0826H6.51023L3.58212 7.88135L7.84383 11.2593C7.98395 11.3705 8.16515 11.4133 8.3391 11.3766C8.51304 11.3412 8.66283 11.2288 8.74739 11.07L12.0451 4.91997L15.3429 11.0687C15.4275 11.2276 15.5772 11.34 15.7512 11.3754C15.9263 11.412 16.1063 11.3693 16.2465 11.2581L20.5082 7.88013L17.5801 16.0826Z"
          fill="#EEAF56"
        />
        <path
          d="M17.7296 17.6425H6.02297C5.69548 17.6425 5.42969 17.9465 5.42969 18.321C5.42969 18.6956 5.69548 18.9996 6.02297 18.9996H17.7296C18.0571 18.9996 18.3229 18.6956 18.3229 18.321C18.3229 17.9465 18.0571 17.6425 17.7296 17.6425Z"
          fill="#EEAF56"
        />
        <path
          d="M6.10948 16.4555L2.54688 6.44624L8.31491 10.5178L12.2168 4.07117L16.1187 10.5178L21.7171 6.78553L18.1545 16.4555H6.10948Z"
          fill="#EEAF56"
        />
        <ellipse
          cx="1.86613"
          cy="5.25858"
          rx="1.86613"
          ry="1.86613"
          fill="#EEAF56"
        />
        <ellipse
          cx="12.0458"
          cy="1.86613"
          rx="1.86613"
          ry="1.86613"
          fill="#EEAF56"
        />
        <ellipse
          cx="22.2255"
          cy="5.25858"
          rx="1.86613"
          ry="1.86613"
          fill="#EEAF56"
        />
      </g>
      <defs>
        <clipPath id="clip0_1535_10686">
          <rect width="24.093" height="18.9997" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
