import React, { CSSProperties } from "react";

type ButtonType = "default" | "primary";
type ButtonShape = "default" | "circle";
type ButtonHTMLType = "submit" | "button" | "reset";
export type ButtonSize = "large" | "middle" | "small";

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: ButtonSize;
  style?: CSSProperties;
  disabled?: boolean;
  loading?: boolean | { delay: number };
  className?: string;
  block?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  htmlType?: ButtonHTMLType;
  iconPosition?: "start" | "end";
  animated?: boolean;
}
