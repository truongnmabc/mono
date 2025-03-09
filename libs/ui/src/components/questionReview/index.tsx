'use client';

import {
  CancelRounded,
  CheckCircleRounded,
  ExpandMore,
} from '@mui/icons-material';
import GetIconPrefix from '@ui/components/choicesPanel/getIcon';
import LazyLoadImage from '@ui/components/images';
import Reaction from '@ui/components/reaction';
import { baseImageUrl } from '@ui/constants/index';
import RouterApp from '@ui/constants/router.constant';
import { ICurrentGame } from '@ui/models/game';
import { selectAppInfo } from '@ui/redux/features/appInfo.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import { useAppSelector } from '@ui/redux/store';
import { decrypt } from '@ui/utils/crypto';
import ctx from '@ui/utils/twClass';
import { MathJax } from 'better-react-mathjax';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import IconGetProHover from '../home/gridTests/icon/iconGetProHover';
const QuestionResult = ({
  item,
  type = 'default',
  isMobile,
}: {
  item: ICurrentGame;
  type?: 'default' | 'custom';
  isMobile: boolean;
}) => {
  const statusShow = !item.selectedAnswer
    ? 'unanswered'
    : item.selectedAnswer.correct
    ? 'correct'
    : item.selectedAnswer.correct === false
    ? 'incorrect'
    : 'incorrect';
  if (type === 'custom') {
    return (
      <div className="p-1 w-full h-full">
        <div
          className="rounded-lg bg-white  w-full h-full flex flex-col  flex-1"
          style={{
            boxShadow: ' 0px 2px 8px 0px #21212129',
          }}
        >
          <div className="w-full rounded-t-lg bg-[#FFFBE1] overflow-hidden flex items-center justify-between px-3 py-2 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 flex items-center justify-center rounded-md">
                <LazyLoadImage classNames="w-6 h-6" src={item?.icon || ''} />
              </div>

              <p className="text-base flex-1  font-medium capitalize ">
                {item?.tag?.replaceAll('-', ' ')}
              </p>
            </div>
          </div>
          <div className="flex px-4 pt-4 items-center justify-between">
            <QuestionStatusReview status={statusShow} />
            <Reaction item={item} isMobile={isMobile} />
          </div>
          <ContentAnswer item={item} status={statusShow} isMobile={isMobile} />
        </div>
      </div>
    );
  }
  return (
    <div
      className="rounded-lg  w-full h-full flex flex-col flex-1"
      style={{
        boxShadow: ' 0px 2px 8px 0px #21212129',
      }}
    >
      <div className="w-full  rounded-t-lg bg-[#FFFBE1] overflow-hidden flex items-center justify-between px-3 py-2 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 flex items-center justify-center rounded-md">
            <LazyLoadImage classNames="w-6 h-6" src={item?.icon || ''} />
          </div>

          <p className="text-base flex-1  font-medium capitalize ">
            {item?.tag?.replaceAll('-', ' ')}
          </p>
        </div>
        <Reaction item={item} isMobile={isMobile} />
      </div>
      <ContentAnswer item={item} status={statusShow} isMobile={isMobile} />
    </div>
  );
};

const ContentAnswer = ({
  item,
  status,
  isMobile,
}: {
  item: ICurrentGame;
  status: 'incorrect' | 'correct' | 'unanswered';
  isMobile: boolean;
}) => {
  const appInfo = useAppSelector(selectAppInfo);
  const userInfos = useAppSelector(selectUserInfo);

  const router = useRouter();
  const handleClickGetPro = () => {
    router.push(RouterApp.Get_pro);
  };

  return (
    <div className="rounded-b-lg  bg-white flex flex-1 overflow-hidden  flex-col gap-4 p-4">
      <div className="w-full flex justify-between gap-2 ">
        {item?.text && (
          <MathJax dynamic>
            <span
              dangerouslySetInnerHTML={{
                __html: decrypt(item?.text) || '',
              }}
              className="text-sm font-normal  sm:text-base"
            />
          </MathJax>
        )}
        {item?.image && (
          <LazyLoadImage
            key={item.image}
            isPreview
            src={`${baseImageUrl}${appInfo.appShortName}/images/${item.image}`}
            alt={item.image}
            classNames="w-16 sm:w-[240px] cursor-pointer aspect-video min-h-16 max-h-24"
          />
        )}
      </div>
      {!isMobile && <QuestionStatusReview status={status} />}
      <div className={'grid gap-2 grid-cols-1 sm:grid-cols-2'}>
        {item?.answers?.map((choice, index) => (
          <div
            className={ctx(
              'flex gap-2 w-full h-full bg-white sm:bg-transparent items-center rounded-md border border-solid px-4 py-3 hover:bg-[#2121210a]',
              {
                'border-[#21212185]': item?.selectedAnswer?.id === choice?.id,
                'border-[#07C58C]': choice.correct,
              }
            )}
            key={index}
            id={(index + 1).toString()}
          >
            <GetIconPrefix
              isActions={false}
              isSelect={item?.selectedAnswer?.id === choice?.id}
              isReview={true}
              answerCorrect={choice.correct}
            />
            {choice?.text && (
              <MathJax dynamic>
                <span
                  dangerouslySetInnerHTML={{
                    __html: choice?.text || '',
                  }}
                  className={clsx('text-xs', {})}
                />
              </MathJax>
            )}
          </div>
        ))}
      </div>
      {userInfos.isPro ? (
        <div className=" hidden sm:block">
          <p className="text-sm font-medium text-[#5497FF] pb-2">Explanation</p>
          {item?.explanation && (
            <MathJax dynamic>
              <span
                dangerouslySetInnerHTML={{
                  __html: decrypt(item?.explanation) || '',
                }}
                className={clsx('text-sm font-normal   h-full  sm:text-base')}
              />
            </MathJax>
          )}
        </div>
      ) : (
        <div
          className="flex mt-1 cursor-pointer items-center gap-2"
          onClick={handleClickGetPro}
        >
          <p className="text-base text-[#5497FF] font-medium">
            Show Explanation
          </p>
          <ExpandMore sx={{ color: '#5497FF' }} />
          <IconGetProHover />
        </div>
      )}
    </div>
  );
};

export default QuestionResult;

const QuestionStatusReview = ({
  status,
}: {
  status: 'incorrect' | 'correct' | 'unanswered';
}) => {
  return (
    <div>
      {status === 'unanswered' && (
        <div className="flex text-sm sm:text-base transition-all gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="11.5" fill="#BFBFBF" stroke="#BFBFBF" />
            <path
              d="M7.39844 12H16.3984"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <div className=" flex-1 text-[#BFBFBF] uppercase">Unanswered</div>
        </div>
      )}
      {status === 'correct' && (
        <div className="flex text-sm sm:text-base transition-all gap-2">
          <div className="w-6 h-6">
            <CheckCircleRounded htmlColor="#00c17c" />
          </div>
          <div className="text-[#00c17c]">CORRECT</div>
        </div>
      )}
      {status === 'incorrect' && (
        <div className="flex text-sm sm:text-base transition-all gap-2">
          <div className="w-6 h-6">
            <CancelRounded htmlColor="#fb7072" />
          </div>
          <div className="text-[#FF746D]">INCORRECT</div>
        </div>
      )}
    </div>
  );
};
