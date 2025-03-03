// components/Modal/UnlockProModal.tsx

import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { selectCurrentTopicId } from '@ui/redux/features/game.reselect';
// import { shouldOpenUnlock } from '@ui/redux/features/tests';
import finishFinalThunk from '@ui/redux/repository/game/finish/finishFinal';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { MtUiButton } from '../button';
import DialogResponsive from '../dialogResponsive';
import LazyLoadImage from '../images';
// components/Modal/ModalContent.tsx
const ModalContent = () => {
  // const { openUnlock } = useAppSelector(testState);
  const openUnlock = false;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const testId = useSearchParams()?.get('testId');
  const id = useAppSelector(selectCurrentTopicId);

  const handleGetPro = () => {
    router.push(RouterApp.Get_pro, {
      scroll: true,
    });
    handleClose();
  };
  const handleSubmit = () => {
    const _href = `${RouterApp.ResultTest}?type=${TypeParam.finalTest}&testId=${
      testId || id
    }`;
    router.push(_href, {
      scroll: true,
    });
    dispatch(finishFinalThunk());
    handleClose();
  };

  const handleClose = () => {
    // dispatch(shouldOpenUnlock(false));
  };
  return (
    <DialogResponsive
      open={openUnlock}
      close={handleClose}
      dialogRest={{
        PaperProps: {
          sx: {
            width: '520px',
            borderRadius: '12px',
          },
        },
      }}
      sheetRest={{
        swipeToClose: true,
      }}
    >
      <div className="flex bg-[#F9F7EE] flex-col w-full h-full p-4 sm:p-8 items-center text-center">
        <CrownIcon />
        <h2 className="mb-3 mt-4 text-2xl font-semibold text-black">
          Unlock the Full Test with PRO!
        </h2>
        <div className=" flex items-center justify-center gap-2">
          <CheckIcon />
          You&apos;ve completed the first 50 questions!
          <PartyIcon className="h-5 w-5" />
        </div>
        <div className="my-8">
          <p className="mb-4 text-base font-normal">
            To access the remaining questions and get a complete evaluation,
            upgrade to PRO.
          </p>
          <p className="text-sm text-[#212121AD] font-normal">
            Don&apos;t want to upgrade? You can submit now and get results for
            the first 50 questions.
          </p>
        </div>
        <div className="w-full space-y-4">
          <MtUiButton
            block
            type="primary"
            className="h-12 "
            onClick={handleGetPro}
          >
            <div className="flex  items-center gap-2">
              <CrownIconSubmid />
              <p className="text-base text-white font-semibold">Get PRO</p>
            </div>
          </MtUiButton>
          <MtUiButton
            block
            className="h-12 border-none sm:border-primary sm:border-solid sm:border-1 bg-transparent sm:bg-white"
            onClick={handleSubmit}
          >
            <div className="flex  items-center gap-2">
              <PaperAirplaneIcon />
              <p className="text-base text-primary font-semibold">
                Submit & View Results
              </p>
            </div>
          </MtUiButton>
        </div>
      </div>
    </DialogResponsive>
  );
};
export default ModalContent;

// components/Buttons/SubmitButton.tsx
const CrownIconSubmid = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7264 6.55842L11.1705 9.37648L8.8542 5.05729C8.7138 4.79601 8.28937 4.79601 8.14897 5.05729L5.83267 9.37648L2.276 6.55842C2.13479 6.44563 1.93823 6.44238 1.79301 6.54868C1.64779 6.65498 1.59002 6.84485 1.651 7.01525L4.16546 14.0584C4.22242 14.219 4.37406 14.3262 4.54255 14.3262H12.4582C12.6267 14.3262 12.7783 14.219 12.8353 14.0584L15.3498 7.01525C15.4107 6.84485 15.3522 6.65498 15.2078 6.54868C15.0649 6.44238 14.8676 6.44563 14.7264 6.55842ZM12.1774 13.5147H4.82496L2.88015 8.06766L5.71072 10.3112C5.80379 10.3851 5.92414 10.4135 6.03967 10.3891C6.15521 10.3656 6.25469 10.291 6.31086 10.1855L8.50118 6.10077L10.6915 10.1847C10.7477 10.2901 10.8472 10.3648 10.9627 10.3883C11.079 10.4127 11.1986 10.3843 11.2916 10.3104L14.1222 8.06685L12.1774 13.5147Z"
        fill="white"
      />
      <path
        d="M12.275 14.5515H4.49952C4.282 14.5515 4.10547 14.7534 4.10547 15.0022C4.10547 15.251 4.282 15.4529 4.49952 15.4529H12.275C12.4925 15.4529 12.669 15.251 12.669 15.0022C12.669 14.7534 12.4925 14.5515 12.275 14.5515Z"
        fill="white"
      />
      <path
        d="M4.55569 13.763L2.18945 7.11507L6.02051 9.8193L8.61211 5.5376L11.2037 9.8193L14.9221 7.34042L12.5558 13.763H4.55569Z"
        fill="white"
      />
      <ellipse
        cx="1.73946"
        cy="6.32635"
        rx="1.23946"
        ry="1.23944"
        fill="white"
      />
      <ellipse
        cx="8.50118"
        cy="4.07269"
        rx="1.23946"
        ry="1.23944"
        fill="white"
      />
      <ellipse
        cx="15.2609"
        cy="6.32635"
        rx="1.23946"
        ry="1.23944"
        fill="white"
      />
    </svg>
  );
};

// components/Icons/index.tsx
const CrownIcon = () => (
  <svg
    width="40"
    height="36"
    viewBox="0 0 40 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_5581_12846"
      style={{ maskType: 'luminance' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="-1"
      width="40"
      height="37"
    >
      <path d="M40 -0.00830078H0V35.8417H40V-0.00830078Z" fill="white" />
    </mask>
    <g mask="url(#mask0_5581_12846)">
      <path
        d="M21.4584 8.18377C22.2917 7.62364 22.7315 6.8301 22.7778 5.80313C22.7778 5.00958 22.5 4.35608 21.9445 3.84263C21.4352 3.28244 20.787 3.00234 20 3.00234C19.213 3.00234 18.5648 3.28244 18.0555 3.84263C17.5 4.35608 17.2222 5.00958 17.2222 5.80313C17.2685 6.87677 17.7083 7.67031 18.5416 8.18377L14.5833 16.2361C14.2129 16.8429 13.7037 17.2396 13.0556 17.4264C12.4074 17.5664 11.7824 17.403 11.1805 16.9362L5 11.9648C5.37037 11.4981 5.55556 10.9379 5.55556 10.2844C5.55556 9.49083 5.27778 8.83733 4.72222 8.32388C4.21296 7.76369 3.56481 7.48359 2.77778 7.48359C1.99074 7.48359 1.34259 7.76369 0.833333 8.32388C0.277778 8.83733 0 9.49083 0 10.2844C0 11.0779 0.277778 11.7314 0.833333 12.2449C1.34259 12.8051 1.99074 13.0852 2.77778 13.0852C2.82407 13.0852 2.84722 13.0852 2.84722 13.0852L5.97222 30.6601C6.2037 31.7804 6.71296 32.6673 7.5 33.3208C8.33334 34.021 9.28242 34.3711 10.3473 34.3711H29.6527C30.7176 34.3711 31.6666 34.021 32.4999 33.3208C33.287 32.6673 33.7963 31.7804 34.0277 30.6601L37.1528 13.0852H37.2222C38.0093 13.0852 38.6574 12.8051 39.1666 12.2449C39.7222 11.7314 40 11.0779 40 10.2844C40 9.49083 39.7222 8.83733 39.1666 8.32388C38.6574 7.76369 38.0093 7.48359 37.2222 7.48359C36.4352 7.48359 35.7871 7.76369 35.2778 8.32388C34.7222 8.83733 34.4444 9.49083 34.4444 10.2844C34.4444 10.9379 34.6296 11.4981 35 11.9648L28.8194 16.9362C28.2176 17.403 27.5925 17.5664 26.9444 17.4264C26.2963 17.2396 25.7871 16.8429 25.4167 16.2361L21.4584 8.18377Z"
        fill="#FBB701"
      />
    </g>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22.8333C17.5228 22.8333 22 18.3561 22 12.8333C22 7.3104 17.5228 2.83325 12 2.83325C6.47715 2.83325 2 7.3104 2 12.8333C2 18.3561 6.47715 22.8333 12 22.8333Z"
      fill="#07C58C"
    />
    <path
      d="M21.5 12.8333C21.5 18.08 17.2467 22.3333 12 22.3333C6.75329 22.3333 2.5 18.08 2.5 12.8333C2.5 7.58655 6.75329 3.33325 12 3.33325C17.2467 3.33325 21.5 7.58655 21.5 12.8333Z"
      stroke="#07C58C"
    />
    <path
      d="M10.5795 16.4129C10.3795 16.4129 10.1895 16.3329 10.0495 16.1929L7.21945 13.3629C6.92945 13.0729 6.92945 12.5929 7.21945 12.3029C7.50945 12.0129 7.98945 12.0129 8.27945 12.3029L10.5795 14.6029L15.7195 9.46286C16.0095 9.17286 16.4895 9.17286 16.7795 9.46286C17.0695 9.75286 17.0695 10.2329 16.7795 10.5229L11.1095 16.1929C10.9695 16.3329 10.7795 16.4129 10.5795 16.4129Z"
      fill="white"
    />
  </svg>
);

const PartyIcon = ({ className }: { className?: string }) => (
  <LazyLoadImage src="/asvab/happy.png" alt="Party" classNames={className} />
);

const PaperAirplaneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0557 1.02224C16.389 1.25125 16.5347 1.57399 16.493 1.99043L14.4939 14.9834C14.4314 15.2957 14.2649 15.5352 13.9942 15.7018C13.7027 15.8475 13.4111 15.8579 13.1196 15.733L9.37117 14.2026L7.24709 16.5138C6.9139 16.8262 6.53905 16.9094 6.12256 16.7637C5.7269 16.5763 5.51867 16.264 5.49784 15.8267V13.2031C5.49784 13.0782 5.53948 12.9741 5.62279 12.8908L10.8705 7.17515C11.0371 6.9461 11.0267 6.71706 10.8393 6.48799C10.631 6.30062 10.402 6.29021 10.1521 6.45679L3.81107 12.11L1.06226 10.7357C0.70825 10.5483 0.520824 10.2568 0.5 9.86119C0.5 9.46557 0.666587 9.16365 0.999777 8.95543L14.9938 0.959771C15.3686 0.772339 15.7226 0.793161 16.0557 1.02224Z"
      fill="#E3A651"
    />
  </svg>
);
