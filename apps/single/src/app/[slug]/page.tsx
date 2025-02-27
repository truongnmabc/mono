interface Post {
  slug: string;
}
import {
  generateDataPage,
  generateListRewrite,
} from '@ui/utils/generateStaticParams';
// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const posts: Post[] = await generateListRewrite('asvab');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { title, content } = await generateDataPage(slug);
  return (
    <main>
      <h1>{title}</h1>
      <p>{content}</p>
    </main>
  );
}
