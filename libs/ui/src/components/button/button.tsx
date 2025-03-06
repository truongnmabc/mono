'use client';
import MtUiLSpinningBubbles from '@ui/components/loading';
import MtUiRipple, { useRipple } from '@ui/components/ripple';
import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { ForwardRefRenderFunction, useEffect, useState } from 'react';
import { BaseButtonProps } from './type';

const BtnComponent: ForwardRefRenderFunction<
  HTMLButtonElement,
  BaseButtonProps
> = (props, forwardedRef) => {
  const {
    loading = false,
    disabled = false,
    onClick,
    children,
    type = 'default',
    style,
    className,
    icon,
    iconPosition = 'start',
    shape,
    htmlType,
    size = 'middle',
    block,
    animated = true,
  } = props;

  const prefixCls = 'mtui-btn';
  const [isLoading, setIsLoading] = useState(loading);

  const ref = forwardedRef as React.RefObject<HTMLButtonElement>;
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (loading && typeof loading === 'object' && loading.delay) {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, loading.delay);
    } else {
      setIsLoading(!!loading);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [loading]);

  let content = children;
  const defaultClass = clsx(
    prefixCls,
    {
      'px-3 py-1 text-xs rounded-lg ': size === 'small' && shape !== 'circle',
      'px-[18px] py-[6px] text-sm rounded-lg':
        size === 'middle' && shape !== 'circle',
      'px-6 py-2 text-base rounded-lg': size === 'large' && shape !== 'circle',
      [prefixCls + '-share-circle']: shape === 'circle',
      [prefixCls + '-loading']: isLoading,
      'pointer-events-none': isLoading,
      [prefixCls + '-icon']: icon || loading,
      'w-full': block,
    },
    `${prefixCls}-type-${type}`,
    `${prefixCls}-${size}`,
    'border border-solid border-[#d9d9d9] mt-shadow-small'
  );

  if (shape && shape === 'circle' && typeof content === 'string') {
    content = content.slice(0, 1);
  }

  const classes = ctx(defaultClass, className);
  const {
    ripples,
    onClick: onRippleClickHandler,
    onClear: onClearRipple,
  } = useRipple();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (animated) {
      onRippleClickHandler(e);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      type={htmlType}
      style={style}
      disabled={disabled}
      className={classes}
      whileHover={{ y: -8 }} // Hiệu ứng hover phóng nhẹ button
      animate={{ opacity: isLoading ? 0.6 : 1, scale: isLoading ? 0.9 : 1 }} // Hiệu ứng khi loading
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {animated && <MtUiRipple ripples={ripples} onClear={onClearRipple} />}

      {((icon && iconPosition === 'start') ||
        (iconPosition === 'start' && isLoading)) && (
        <motion.div
          className="mtui-btn-item-icon"
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          {icon ? (
            icon
          ) : loading ? (
            <MtUiLSpinningBubbles color="#ccc" width={16} height={16} />
          ) : null}
        </motion.div>
      )}

      {content}

      {((icon && iconPosition === 'end') ||
        (isLoading && iconPosition === 'end')) && (
        <motion.div
          className="mtui-btn-item-icon"
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          {icon ? (
            icon
          ) : loading ? (
            <MtUiLSpinningBubbles color="#ccc" width={16} height={16} />
          ) : null}
        </motion.div>
      )}
    </motion.button>
  );
};

const MtUiButton = React.forwardRef(BtnComponent);

export default MtUiButton;
