import type { RippleType } from "./use-ripple";
import type { HTMLMotionProps } from "framer-motion";
import React, { FC } from "react";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
type As<Props = any> = React.ElementType<Props>;
type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
  as?: As;
};
type HTMLNextUIProps<
  T extends As = "div",
  OmitKeys extends keyof any = never
> = Omit<
  PropsOf<T>,
  | "ref"
  | "color"
  | "slot"
  | "size"
  | "defaultChecked"
  | "defaultValue"
  | OmitKeys
> & {
  as?: As;
};
export interface RippleProps extends HTMLNextUIProps<"span"> {
  ripples: RippleType[];
  color?: string;
  motionProps?: HTMLMotionProps<"span">;
  style?: React.CSSProperties;
  onClear: (key: React.Key) => void;
}

const MtUiRipple: FC<RippleProps> = (props) => {
  const {
    ripples = [],
    motionProps,
    color = "#4233b5e5",
    style,
    onClear,
  } = props;

  return (
    <>
      {ripples.map((ripple: RippleType) => {
        const duration = clamp(
          0.01 * ripple.size,
          0.2,
          ripple.size > 100 ? 0.75 : 0.5
        );

        return (
          <LazyMotion features={domAnimation} key={ripple.key}>
            <AnimatePresence mode="popLayout">
              <m.span
                animate={{ transform: "scale(2)", opacity: 0 }}
                className="nextui-ripple"
                exit={{ opacity: 0 }}
                initial={{ transform: "scale(0)", opacity: 0.35 }}
                style={{
                  position: "absolute",
                  backgroundColor: color,
                  borderRadius: "100%",
                  transformOrigin: "center",
                  pointerEvents: "none",
                  overflow: "hidden",
                  inset: 0,
                  zIndex: 0,
                  top: ripple.y,
                  left: ripple.x,
                  width: `${ripple.size}px`,
                  height: `${ripple.size}px`,
                  ...style,
                }}
                transition={{ duration }}
                onAnimationComplete={() => {
                  onClear(ripple.key);
                }}
                {...motionProps}
              />
            </AnimatePresence>
          </LazyMotion>
        );
      })}
    </>
  );
};

export default MtUiRipple;
