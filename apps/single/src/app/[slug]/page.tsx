import list from '@single/data/seo.json';

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 3600;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const posts = Object.keys(list.rewrite);
  return posts.map((post) => ({
    slug: post,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const data = list.rewrite[slug as keyof typeof list.rewrite] || list.default;
  return {
    title: data.titleSeo,
    description: data.descSeo,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const data = list.rewrite[slug as keyof typeof list.rewrite];
  if (!data) {
    return null; // or handle 404
  }
  return (
    <main>
      <h1>{data.content}</h1>
    </main>
  );
}
