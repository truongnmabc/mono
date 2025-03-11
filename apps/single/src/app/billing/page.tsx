import appInfo from '@single/data/appInfos.json';
import { detectAgent } from '@ui/utils';
import { headers } from 'next/headers';
import BillingPage from './_components';

const BillingApp = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');

  return <BillingPage isMobile={isMobile} appInfo={appInfo} />;
};

export default BillingApp;
