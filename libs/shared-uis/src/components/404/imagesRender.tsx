'use client';

import Image from 'next/image';

type ISize = {
  width: number;
  height: number;
};

const ImagesRender = ({
  name,
  size,
  mobileSize,
  isMobile,
}: {
  name: string;
  size: ISize;
  mobileSize: ISize;
  isMobile: boolean;
}) => {
  const mobileFolder = isMobile ? '/mobile' : '';
  return (
    <Image
      className={name}
      src={'/images/404' + mobileFolder + '/' + name + '.png'}
      alt={name}
      height={isMobile ? size.height : mobileSize.height}
      width={isMobile ? size.width : mobileSize.width}
    />
  );
};

export default ImagesRender;
