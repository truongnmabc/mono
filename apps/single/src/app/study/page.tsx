import Link from 'next/link';
import Components from './_components';

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  // Add 2 second delay

  return (
    <div>
      <Components />
      <Link href="/result">Result</Link>
    </div>
  );
};

export default Page;
