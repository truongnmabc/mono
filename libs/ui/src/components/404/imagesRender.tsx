'use client';

import Image from 'next/image';

type ISize = {
  width: number;
  height: number;
};

const ImagesRender = ({
  src,
  size,
  className,
  mobileSize,
  isMobile,
}: {
  className: string;
  size: ISize;
  mobileSize: ISize;
  isMobile: boolean;
  src: string;
}) => {
  return (
    <Image
      className={className}
      src={src}
      alt={className}
      height={isMobile ? size.height : mobileSize.height}
      width={isMobile ? size.width : mobileSize.width}
    />
  );
};

export default ImagesRender;
