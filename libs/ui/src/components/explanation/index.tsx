'use client';
import { Collapse } from '@mui/material';
import CrownIcon from '@ui/components/icon/iconCrown';
import RouterApp from '@ui/constants/router.constant';
import { selectCurrentGame } from '@ui/redux/features/game.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { useAppSelector } from '@ui/redux/store';
import { decrypt } from '@ui/utils/crypto';
import ctx from '@ui/utils/twClass';
import { MathJax } from 'better-react-mathjax';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

type IProps = {
  unLock?: boolean;
  isMobile?: boolean;
};

const FN: React.FC<IProps> = ({ unLock = false, isMobile }) => {
  const userInfo = useAppSelector(selectUserInfo);
  const currentGame = useAppSelector(selectCurrentGame);

  return (
    <Collapse in={currentGame?.selectedAnswer ? true : false} timeout={200}>
      <Link target="_blank" href={RouterApp.Get_pro}>
        <div className="flex text-[#004fc2] text-sm sm:text-base gap-2 cursor-pointer items-center">
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
      </Link>
      {currentGame?.explanation && (
        <div
          className={ctx('mt-2 ', {
            'blur-content': !userInfo.isPro && !unLock,
          })}
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
                __html:
                  userInfo.isPro || unLock
                    ? decrypt(currentGame?.explanation)
                    : currentGame?.explanation,
              }}
              className={clsx('text-sm font-normal sm:text-base', {
                ' line-clamp-1': !userInfo.isPro && !unLock,
              })}
            />
          </MathJax>
        </div>
      )}
    </Collapse>
  );
};
const ExplanationDetail = React.memo(FN);
export default ExplanationDetail;
