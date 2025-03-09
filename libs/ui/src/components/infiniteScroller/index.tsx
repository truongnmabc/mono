import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { parseThreshold, ThresholdUnits } from './utils/threshold';

interface IInfinityProps {
  children: React.ReactNode;
  fetchNextPage: (page: number) => void;
  isFetchingNextPage?: boolean;
  total?: number;
  dataLength?: number;
  isSuccess?: boolean;
  isLoading?: boolean;
  classNames?: string;
  styles?: CSSProperties;
  isScrollPage?: boolean;
  pageScrollId?: string;
}
const Infinity: React.FC<IInfinityProps> = (props) => {
  const {
    fetchNextPage,
    isFetchingNextPage,
    children,
    classNames,
    styles,
    isScrollPage = false,
    pageScrollId,
  } = props;

  const divRef = useRef<HTMLDivElement | null>(null);
  const actionTriggered = useRef(false);
  const [isFetching, setIsFetching] = useState(false);
  const isElementAtBottom = (
    target: HTMLElement,
    scrollThreshold: string | number = 0.6
  ) => {
    const clientHeight = target.clientHeight;
    const threshold = parseThreshold(scrollThreshold);
    if (threshold.unit === ThresholdUnits.Pixel) {
      return (
        target.scrollTop + clientHeight >= target.scrollHeight - threshold.value
      );
    }
    return (
      target.scrollTop + clientHeight >=
      (threshold.value / 100) * target.scrollHeight
    );
  };
  const startPage = useRef(0);

  const onScrollListener = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const atBottom = isElementAtBottom(target as HTMLElement);
    if (actionTriggered.current) return;

    if (atBottom) {
      actionTriggered.current = true;
      setIsFetching(true);
      startPage.current++;
      fetchNextPage(startPage.current);
    }
  };

  const throttledOnScrollListener = useRef(
    throttle(250, onScrollListener).bind({}) as (e: MouseEvent) => void
  );
  useEffect(() => {
    if (isScrollPage && pageScrollId) {
      const page = document.getElementById(pageScrollId);
      if (page) {
        page.addEventListener(
          'scroll',
          throttledOnScrollListener.current as unknown as EventListenerOrEventListenerObject
        );
      }
      return;
    }
    if (divRef.current) {
      divRef.current.addEventListener(
        'scroll',
        throttledOnScrollListener.current as unknown as EventListenerOrEventListenerObject
      );
    }
  }, [isScrollPage, pageScrollId]);
  useEffect(() => {
    if (!isFetchingNextPage) {
      actionTriggered.current = false;
      setIsFetching(false);
    }
  }, [actionTriggered, isFetchingNextPage]);

  return (
    <div
      className={ctx(
        clsx('w-full h-full ', {
          'overflow-y-auto scroll-smooth': !isScrollPage,
        }),
        classNames
      )}
      ref={divRef}
      style={styles}
    >
      {children}
    </div>
  );
};
const MtUIInfinity = React.memo(Infinity);
export default MtUIInfinity;
