import BannerHome from '@ui/components/banner';
import MyContainer from '@ui/components/container';
import GridTest from '@ui/components/home/gridTests/gridTestHome';
import GridTopics from '@ui/components/home/gridTopic/gridTopics';
import TitleHomeApp from '@ui/components/home/title';
import SeoContent from '@ui/components/seoContent';
import { detectAgent } from '@ui/utils/device';
import appInfos from '@single/data/appInfos.json';
import contentSeo from '@single/data/seo-home.json';
import topics from '@single/data/topicsAndTest.json';
import { headers } from 'next/headers';
import Link from 'next/link';

const Page = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');

  return (
    <MyContainer>
      <TitleHomeApp appInfo={appInfos} />
      <Link href="/study" prefetch={true}>
        Study
      </Link>
      <GridTopics
        isMobile={isMobile}
        topics={topics.topics.map((topic) => ({
          ...topic,
          status: 0,
          averageLevel: 0,
          turn: 1,
          partId: topic.id,
          totalQuestion: 0,
          topics: [],
        }))}
        appInfo={appInfos}
      />
      <GridTest appInfo={appInfos} isMobile={isMobile} />
      <div className="sm:my-[48px] sm:mb-[120px] my-[24px] mb-[48px]">
        <BannerHome appInfo={appInfos} isHomePage={true} />
      </div>
      {contentSeo.content && (
        <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
          <SeoContent content={contentSeo.content} />
        </div>
      )}
    </MyContainer>
  );
};

export default Page;
