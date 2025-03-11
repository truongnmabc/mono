import appInfos from '@single/data/appInfos.json';
import data from '@single/data/server/aboutUs.json';
import LazyLoadImage from '@ui/components/images';
import { IMember } from '@ui/models';
import { detectAgent } from '@ui/utils';
import { replaceYear } from '@ui/utils/time';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import ActivityComponent from './_components/asvab/activity';
import HeaderComponent from './_components/asvab/header';
import './_components/index.scss';
import { listDataAsvab, listMember } from './_components/list';
export const metadata: Metadata = {
  title: replaceYear(data?.titleSeo),
  description: replaceYear(data?.descSeo),
  openGraph: {
    title: replaceYear(data?.titleSeo),
    description: replaceYear(data?.descSeo),
  },
  twitter: {
    title: replaceYear(data?.titleSeo),
    description: replaceYear(data?.descSeo),
  },
  alternates: {
    canonical: `${process.env['NEXT_PUBLIC_API_URL']}review`,
  },
};

const handleMember = (memberQueryWp: IMember[], appShortName: string) => {
  const mapB = new Map(
    memberQueryWp.map((item) => {
      if (item.role == 'editor') {
        return [item.name, { ...item, role: 'Content Writer' }];
      } else {
        return [item.name, item];
      }
    })
  );
  const mergeArray = listMember.map((item) => {
    if (mapB.has(item.name)) {
      const updatedItem = { ...item, ...mapB.get(item.name) };
      mapB.delete(item.name);
      return updatedItem;
    }
    return item;
  });
  const remainingFromB = Array.from(mapB.values());
  switch (appShortName) {
    case 'cdl':
      return [...mergeArray, ...remainingFromB];
    case 'asvab':
      return listDataAsvab;
    default:
      return listDataAsvab;
  }
};

export default async function Page() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
  const listMember = handleMember(data.listMember, appInfos.appShortName);
  return (
    <div className="about-us-container">
      <HeaderComponent appInfo={appInfos} isMobile={isMobile} />

      <div className="about-us-bottom">
        <ActivityComponent isMobile={isMobile} />
        <div className="meet-the-team max-w-component-desktop">
          <div className="title-meet-the-team">Meet The Team</div>
          <div className="members">
            {listMember.map((item, index) => {
              const _href = `${process.env['NEXT_PUBLIC_API_URL']}author/${item.user_nicename}`;

              return (
                <Link href={_href} key={index} target="_blank">
                  <div className="info-member">
                    <div className="avatar">
                      <LazyLoadImage src={item.avatar} alt="" />
                    </div>
                    <div className="name">{item.name}</div>
                    <div className="position">{item.role}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
