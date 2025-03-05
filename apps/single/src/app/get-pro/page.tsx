import appInfos from '@single/data/appInfos.json';
import dataSeo from '@single/data/server/getPro.json';
import { replaceYear } from '@ui/utils/time';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import HeaderGetPro from './components/get-pro/header';
import ListReview from './components/get-pro/listReview';
import Pricing from './components/get-pro/pricingCard';
import StoreLogoPro from './components/get-pro/storeLogo';
export const metadata: Metadata = {
  title: replaceYear(dataSeo.title),
  description: replaceYear(dataSeo.description),
  openGraph: {
    title: replaceYear(dataSeo.title),
    description: replaceYear(dataSeo.description),
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
