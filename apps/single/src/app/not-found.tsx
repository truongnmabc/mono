import React from 'react';
import Page404Container from '@ui/components/404';

import { headers } from 'next/headers';
import { detectAgent } from '@ui/utils/device';

export default async function Page() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const { isMobile } = detectAgent(userAgent || '');
  return <Page404Container isMobile={isMobile} />;
}
