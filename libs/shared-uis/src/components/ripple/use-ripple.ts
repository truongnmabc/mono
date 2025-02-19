import React, { useCallback, useState } from "react";

export type RippleType = {
  key: React.Key;
  x: number;
  y: number;
  size: number;
};
export function getUniqueID(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 1000000)}`;
}
export interface UseRippleProps {}

export function useRipple(props: UseRippleProps = {}) {
  const [ripples, setRipples] = useState<RippleType[]>([]);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const trigger = event.currentTarget;

      const size = Math.max(trigger.clientWidth, trigger.clientHeight);
      const rect = trigger.getBoundingClientRect();

      setRipples((prevRipples: any) => [
        ...prevRipples,
        {
          key: getUniqueID(prevRipples.length.toString()),
          size,
          x: event.clientX - rect.left - size / 2,
          y: event.clientY - rect.top - size / 2,
        },
      ]);
    },
    []
  );

  const onClear = useCallback((key: React.Key) => {
    setRipples((prevState: any) =>
      prevState.filter((ripple: any) => ripple.key !== key)
    );
  }, []);

  return { ripples, onClick, onClear, ...props };
}

export type UseRippleReturn = ReturnType<typeof useRipple>;
