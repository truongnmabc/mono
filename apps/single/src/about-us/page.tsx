import appInfo from '@single/data/appInfos.json';
import AboutUsContainer from './_components';

export default async function Page() {
  return <AboutUsContainer appInfo={appInfo} />;
}
