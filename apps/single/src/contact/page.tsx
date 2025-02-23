import appInfo from '@single/data/appInfos.json';
import type { Metadata } from 'next';
import ContactsScreen from './_components';

export const metadata: Metadata = {
  title: 'Contact us – ABC Elearning',
  description: '...',
};

const Page = async () => {
  return <ContactsScreen appInfo={appInfo} />;
};

export default Page;
