'use client';
import { Collapse } from '@mui/material';
import CrownIcon from '@ui/components/icon/iconCrown';
import RouterApp from '@ui/constants/router.constant';
import { useIsMobile } from '@ui/hooks/useIsMobile';
import { selectCurrentGame } from '@ui/redux/features/game.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { useAppSelector } from '@ui/redux/store';
import { decrypt } from '@ui/utils/crypto';
import { trackingEventGa4 } from '@ui/utils/event';
import ctx from '@ui/utils/twClass';
import { MathJax } from 'better-react-mathjax';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

type IProps = {
  unLock?: boolean;
};

const FN: React.FC<IProps> = ({ unLock = false }) => {
  const isMobile = useIsMobile();
  const userInfo = useAppSelector(selectUserInfo);
  const [text, setText] = useState<string>('');
  const currentGame = useAppSelector(selectCurrentGame);
  useEffect(() => {
    if (currentGame?.text && currentGame?.id) {
      try {
        if (userInfo.isPro || unLock) {
          const content = decrypt(currentGame?.explanation);
          setText(content);
        } else {
          setText(currentGame?.explanation);
        }
      } catch (err) {
        console.log('🚀 ~ useEffect ~ err:', err);
      }
    }
  }, [
    currentGame?.id,
    currentGame?.text,
    currentGame?.explanation,
    userInfo,
    unLock,
  ]);
  return (
    <Collapse in={currentGame?.selectedAnswer ? true : false} timeout={200}>
      <div className="flex text-[#004fc2] text-sm sm:text-base gap-2 items-center">
        Explanation
        {!userInfo.isPro && !unLock && (
          <div className="flex items-center gap-1">
            {!isMobile ? '(Get' : ''}
            <div className="flex gap-1 px-2 text-white text-xs py-1 rounded-2xl bg-black items-center">
              <CrownIcon />
              Pro
            </div>
            {!isMobile ? 'to show this content)' : ''}
          </div>
        )}
      </div>
      <div
        className={ctx('mt-2 ', {
          'blur-content': !userInfo.isPro && !unLock,
        })}
        onClick={() => {
          if (!userInfo.isPro) {
            trackingEventGa4({
              eventName: 'click_pro_explain',
              value: {},
            });

            window.open(RouterApp.Get_pro, '_blank');
          }
        }}
      >
        <MathJax
          style={{
            fontSize: 12,
          }}
          dynamic
          renderMode="post"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: text,
            }}
            className={clsx('text-sm font-normal sm:text-base', {
              ' line-clamp-1': !userInfo.isPro && !unLock,
            })}
          />
        </MathJax>
      </div>
    </Collapse>
  );
};
const ExplanationDetail = React.memo(FN);
export default ExplanationDetail;
