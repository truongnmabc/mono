// import BannerHome from '@shared-uis/components/banner';
// import MyContainer from '@shared-uis/components/container';
// import GridTest from '@shared-uis/components/home/gridTests/gridTestHome';
// import GridTopics from '@shared-uis/components/home/gridTopic/gridTopics';
// import TitleHomeApp from '@shared-uis/components/home/title';
// import SeoContent from '@shared-uis/components/seoContent';
import { detectAgent } from '@shared-utils/device';
// import appInfos from '@single/data/appInfos.json';
// import contentSeo from '@single/data/seo-home.json';
// import topics from '@single/data/topicsAndTest.json';
import { headers } from 'next/headers';

const Page = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');

  return <div>Hello</div>;
  // return (
  //   <MyContainer>
  //     <TitleHomeApp appInfo={appInfos} />â
  //     <GridTopics
  //       isMobile={isMobile}
  //       topics={topics.topics.map((topic) => ({
  //         ...topic,
  //         status: 0,
  //         averageLevel: 0,
  //         turn: 1,
  //         partId: topic.id,
  //         totalQuestion: 0,
  //         topics: [],
  //       }))}
  //       appInfo={appInfos}
  //     />
  //     <GridTest />
  //     <div className="sm:my-[48px] sm:mb-[120px] my-[24px] mb-[48px]">
  //       <BannerHome appInfo={appInfos} isHomePage={true} />
  //     </div>
  //     {contentSeo.content && (
  //       <div className="p-4 mb-28 sm:mb-0 sm:p-6 rounded-md  overflow-hidden bg-white dark:bg-black">
  //         <SeoContent content={contentSeo.content} />
  //       </div>
  //     )}
  //   </MyContainer>
  // );
};

export default Page;
