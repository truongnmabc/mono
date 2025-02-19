"use client";

import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";
import { makeStore } from "../redux/store";

export const eventSendGtag = ({
  eventName,
  value,
}: {
  eventName: string;
  value: unknown;
}) => {
  const store = makeStore().getState();
  const { appShortName } = store.appInfoReducer.appInfo;
  if (process.env.NODE_ENV !== "development")
    sendGTMEvent({ event: `${appShortName}-${eventName}`, value: value });
};

export const trackingEventGa4 = ({
  eventName,
  value,
}: {
  eventName: string;
  value: unknown;
}) => {
  const store = makeStore().getState();

  const { appShortName } = store.appInfoReducer.appInfo;
  if (process.env.NODE_ENV !== "development")
    sendGAEvent("event", `${appShortName}-${eventName}`, { value: value });
};
