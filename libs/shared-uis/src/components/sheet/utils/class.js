"use client";
const CLASS_PREFIX = "zaui";
export const getPrefixCls = function getPrefixCls(
  suffixCls,
  customizePrefixCls
) {
  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? CLASS_PREFIX + "-" + suffixCls : CLASS_PREFIX;
};
