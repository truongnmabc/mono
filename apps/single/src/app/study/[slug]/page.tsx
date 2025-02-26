import Components from './_components';

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  return (
    <div>
      <Components />
    </div>
  );
};

export default Page;
