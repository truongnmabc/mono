import appInfos from '@single/data/appInfos.json';
import dataSeo from '@single/data/server/getPro.json';
import HeaderGetPro from '@ui/container/get-pro/header';
import ListReview from '@ui/container/get-pro/listReview';
import Pricing from '@ui/container/get-pro/pricingCard';
import StoreLogoPro from '@ui/container/get-pro/storeLogo';
import { replaceYear } from '@ui/utils/time';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: replaceYear(dataSeo.titleSeo),
  description: replaceYear(dataSeo.descSeo),
  openGraph: {
    title: replaceYear(dataSeo.titleSeo),
    description: replaceYear(dataSeo.descSeo),
  },
  twitter: {
    title: replaceYear(dataSeo?.titleSeo),
    description: replaceYear(dataSeo?.descSeo),
  },
  alternates: {
    canonical: `${process.env['NEXT_PUBLIC_API_URL']}get-pro`,
  },
};

export default async function Page() {
  const cookieStore = await cookies();
  const device = cookieStore.get('device');
  const isMobile = device?.value.includes('mobile') ?? false;
  const url = process.env['NEXT_PUBLIC_API_URL'] ?? '';
  const urlApp = new URL(url);
  const appName = urlApp.hostname.toUpperCase();
  return (
    <div className="w-full  h-full">
      <HeaderGetPro appName={appInfos.appName} isMobile={isMobile} />
      <StoreLogoPro appInfo={appInfos} isMobile={isMobile} />
      <Pricing appInfo={appInfos} isMobile={isMobile} />
      <div className="w-full pb-8 pt-20">
        <h2 className="text-center font-semibold leading-tight text-3xl px-4 sm:text-[48px]">
          What our users are saying
        </h2>
        <h3 className="text-center mt-6 text-base font-medium text-[#705E57]">
          Over 50,000 aspiring American candidates use {appName} monthly
        </h3>
        <ListReview />
      </div>
    </div>
  );
}
