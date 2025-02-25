import React from 'react';
import Components from './_components';

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  console.log('🚀 ~ Page ~ slug:', slug);
  return (
    <div>
      <Components />
    </div>
  );
};

export default Page;
