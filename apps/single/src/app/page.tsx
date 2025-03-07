import BannerHome from '@ui/components/banner';
import MyContainer from '@ui/components/container';
import GridTest from '@ui/components/home/gridTests/gridTestHome';
import GridTopics from '@ui/components/home/gridTopic/gridTopics';
import TitleHomeApp from '@ui/components/home/title';
import SeoContent from '@ui/components/seoContent';
import { detectAgent } from '@ui/utils/device';
import appInfos from '@single/data/appInfos.json';
import data from '@single/data/home/data.json';
import { headers } from 'next/headers';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { selectTest, selectTopic } = await searchParams;
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
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
        isMobile={isMobile}
        tests={data.tests}
        showList={selectTest === 'true'}
      />
      <div className="sm:my-[48px] sm:mb-[120px] my-[24px] mb-[48px]">
        <BannerHome appInfo={appInfos} isHomePage={true} />
      </div>
      {data.seo.content && (
        <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
          <SeoContent content={data.seo.content} />
        </div>
      )}
    </MyContainer>
  );
};

export default Page;
