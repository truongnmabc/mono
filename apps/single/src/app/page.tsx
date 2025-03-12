import appInfos from '@single/data/appInfos.json';
import data from '@single/data/home/data.json';
import BannerHome from '@ui/components/banner';
import MyContainer from '@ui/components/container';
import GridTest from '@ui/components/home/gridTests/gridTestHome';
import GridTopics from '@ui/components/home/gridTopic/gridTopics';
import TitleHomeApp from '@ui/components/home/title';
import SeoContent from '@ui/components/seoContent';
import { detectAgent } from '@ui/utils/device';
import { cookies, headers } from 'next/headers';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { selectTest, selectTopic } = await searchParams;
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
  const cookieStore = await cookies();
  const device = cookieStore.get('device');
  const isPro = cookieStore.get('isPro');

  return (
    <MyContainer>
      <TitleHomeApp appInfo={appInfos} />
      <GridTopics
        isMobile={isMobile}
        topics={data.topics}
        appInfo={appInfos}
        selectTopic={selectTopic}
      />
      <GridTest
        appInfo={appInfos}
        isMobile={device?.value?.includes('mobile') || false}
        tests={data.tests}
        showList={selectTest === 'true'}
        // isPro={isPro?.value === 'true' || false}
        isPro={true}
      />
      <div className="sm:my-12 sm:mb-[120px] my-6 mb-12">
        <BannerHome appInfo={appInfos} isHomePage={true} />
        {data.seo.content && (
          <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md mt-8  overflow-hidden bg-white dark:bg-black">
            <SeoContent content={data.seo.content} />
          </div>
        )}
      </div>
    </MyContainer>
  );
};

export default Page;
