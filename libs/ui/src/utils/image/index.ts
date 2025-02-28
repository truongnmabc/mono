import { BASE_IMAGE_URL, PATH_IMAGE } from '@ui/constants';

export const getImageSrc = (src: string) => {
  const bucket = process.env['NEXT_PUBLIC_APP_SHORT_NAME'];
  return `${BASE_IMAGE_URL}/${bucket}/${PATH_IMAGE}/${src}`;
};
