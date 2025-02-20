'use client';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Dialog } from '@mui/material';
import { useIsMobile } from '@shared-uis/hooks';
import ctx from '@shared-utils/twClass';
import clsx from 'clsx';
import Image from 'next/image';
import React, { CSSProperties, useCallback, useState } from 'react';

export interface ILazyLoadImages {
  src: string;
  alt?: string;
  classNames?: string;
  styles?: CSSProperties;
  imgStyles?: CSSProperties;
  imgClassNames?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  priority?: boolean;
  draggable?: boolean;
  isPreview?: boolean;
  width?: number;
  height?: number;
}

const FALLBACK_IMAGE = '/images/logo/logo60.png';

const LazyLoadImage: React.FC<ILazyLoadImages> = ({
  src,
  alt,
  imgClassNames,
  imgStyles,
  classNames,
  styles,
  onClick,
  priority = true,
  isPreview = false,
  width = 500,
  height = 300,
  ...rest
}) => {
  const imgAlt = alt || 'Image';
  const isMobile = useIsMobile();
  const [imageSrc, setImageSrc] = useState(src);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = useCallback(() => {
    if (isPreview) setIsDialogOpen(true);
  }, [isPreview]);

  const handleImageError = useCallback(() => {
    setImageSrc(FALLBACK_IMAGE);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return (
    <div
      style={styles}
      className={ctx('relative w-full h-full', classNames)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt={imgAlt}
          width={width}
          height={height}
          onError={handleImageError}
          className={ctx(
            'object-contain w-full h-full transition-all',
            imgClassNames
          )}
          draggable={false}
          priority={priority}
          style={imgStyles}
          {...rest}
        />

        {/* Zoom Icon - Hiển thị khi hover */}
        {isPreview && (
          <div
            onClick={handleOpenDialog}
            className={clsx(
              'absolute  flex items-center justify-center   transition-opacity  rounded-md cursor-pointer',
              {
                'opacity-0 inset-0 bg-black/30  hover:opacity-100': !isMobile,
                'bottom-0 right-0  ': isMobile,
              }
            )}
          >
            <ZoomInIcon
              className={clsx({
                'text-white': !isMobile,
                'text-black/30': isMobile,
              })}
            />
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <Image
          src={imageSrc}
          alt={imgAlt}
          width={width * 2}
          height={height * 2}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
          className={ctx(
            'object-contain w-full h-full transition-all',
            imgClassNames
          )}
          priority={priority}
          style={imgStyles}
          {...rest}
        />
      </Dialog>
    </div>
  );
};

export default LazyLoadImage;
