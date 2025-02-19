'use client';

import { sendGAEvent, sendGTMEvent } from '@next/third-parties/google';

export const eventSendGtag = ({
  eventName,
  value,
}: {
  eventName: string;
  value: unknown;
}) => {
  const appShortName = process.env['NEXT_PUBLIC_APP_SHORT_NAME'];
  if (process.env['NODE_ENV'] !== 'development')
    sendGTMEvent({ event: `${appShortName}-${eventName}`, value: value });
};

export const trackingEventGa4 = ({
  eventName,
  value,
}: {
  eventName: string;
  value: unknown;
}) => {
  const appShortName = process.env['NEXT_PUBLIC_APP_SHORT_NAME'];

  if (process.env['NODE_ENV'] !== 'development')
    sendGAEvent('event', `${appShortName}-${eventName}`, { value: value });
};
