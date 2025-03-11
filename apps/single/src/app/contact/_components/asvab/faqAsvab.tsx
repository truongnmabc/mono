import clsx from 'clsx';
import Link from 'next/link';
import './index.scss';
export interface IFAQData {
  question: string;
  answer: string | React.ReactNode;
}

const AnswerIndex2Component = () => {
  return (
    <>
      <div>
        {' '}
        If you are using our website, the cancellation depends on the terms of
        Paypal. Please access this link for more information:{' '}
        <Link href="https://www.paypal.com/us/cshelp/article/what-is-an-automatic-payment-and-how-do-i-update-or-cancel-one-help240">
          https://www.paypal.com/us/cshelp/article/what-is-an-automatic-payment-and-how-do-i-update-or-cancel-one-help240
        </Link>
      </div>
      <div>
        If you are using our application, the cancellation depends on the terms
        of IOS or Android. Please access these links for more information:
      </div>
      <ul>
        <li>
          The terms of use:{' '}
          <Link
            href="https://abc-elearning-app.github.io/terms-of-use/index.html"
            target="__blank"
            rel="nofollow"
          >
            https://abc-elearning-app.github.io/terms-of-use/index.html
          </Link>
        </li>
        <li>
          Cancellation for IOS:{' '}
          <Link
            href="https://support.apple.com/en-vn/HT202039"
            target="__blank"
          >
            https://support.apple.com/en-vn/HT202039
          </Link>
        </li>
        <li>
          Cancellation for Android:{' '}
          <Link
            href="https://support.google.com/googleplay/answer/7018481?hl=en&co=GENIE.Platform%3DAndroid"
            target="__blank"
          >
            https://support.google.com/googleplay/answer/7018481?hl=en&co=GENIE.Platform%3DAndroid
          </Link>
        </li>
      </ul>
    </>
  );
};

const AnswerIndex5Component = () => {
  return (
    <ul className="answer-index-5">
      <li>
        If your purchase was made through our website: Please request a refund
        through PayPal, which is the payment processor for transactions on our
        site. You can initiate this process by following this link:{' '}
        <Link
          href="https://www.paypal.com/us/cshelp/article/how-do-i-get-a-refund-help100"
          target="__blank"
        >
          PayPal Refund Support.
        </Link>
      </li>
      <li>
        If your purchase was made through IOS: Apple handles all transactions
        and refunds made through the app, so they will be best equipped to
        assist you. Please request a refund through the Apple Store. You can
        initiate this process by following this link:{' '}
        <Link href="https://support.apple.com/en-vn/118223" target="__blank">
          Apple Refund Support
        </Link>
      </li>
      <li>
        If your purchase was made through Android: Google handles all
        transactions and refund requests for purchases made through their
        platform. Please request a refund through Google Play. You can start the
        process by visiting this link:{' '}
        <Link
          href="https://support.google.com/googleplay/answer/2479637?visit_id=638581628161525400-2510090661&rd=1"
          target="__blank"
        >
          Google Play Refund Support
        </Link>
      </li>
    </ul>
  );
};
const AnswerIndex0Component = () => {
  return (
    <span>
      'The questions may not be an exact replica of the exam questions, but they
      closely follow the content covered in the real exam. By practicing with
      our questions, learners can develop a strong understanding of the concepts
      and topics that are essential for success in the real exam.',
    </span>
  );
};
const AnswerIndex1Component = () => {
  return (
    <span>
      'Please log in to the app/web by our login feature with the same email
      that was registered with the PRO version so that all the data and progress
      can be synchronized.',
    </span>
  );
};
const AnswerIndex3Component = () => {
  return (
    <span>
      "No. While our ASVAB Prep test is designed to mirror the actual ASVAB in
      content and format closely, it is intended solely as a practice tool to
      help learners prepare and familiarize themselves with the test. The
      results from our practice tests, while useful for gauging one's progress,
      do not carry the same weight or recognition as the official ASVAB standard
      score.",
    </span>
  );
};
const AnswerIndex4Component = () => {
  return (
    <span>
      'No. At the moment, our platform only has an English language version
      available. Our development team is actively reviewing the feasibility and
      timeline for adding new language options in the future.',
    </span>
  );
};
const FAQDataAsvab: IFAQData[] = [
  {
    question: 'Do the ASVAB Prep questions appear on the official test?',
    answer: <AnswerIndex0Component />,
  },
  {
    question: 'How does my account sync between the app and the web?',
    answer: <AnswerIndex1Component />,
  },
  {
    question: 'How do I cancel subscriptions?',
    answer: <AnswerIndex2Component />,
  },
  {
    question: 'Can I use the ASVAB Prep test result as the Standard Score?',
    answer: <AnswerIndex3Component />,
  },
  {
    question: 'Can I change to another language?',
    answer: <AnswerIndex4Component />,
  },
  {
    question: 'How can I request a refund?',
    answer: <AnswerIndex5Component />,
  },
];

const FaqAsvab = ({
  isMobile,
  openBox,
}: {
  isMobile: boolean;
  openBox?: string;
}) => {
  return (
    <div className="w-full flex gap-3 flex-col">
      {FAQDataAsvab.map((data, index) => {
        const isOpen = openBox === index.toString();
        const href = isOpen ? '?' : `?openBox=${index}`;
        return (
          <div
            className={clsx(
              ' rounded-lg contact-box-faq-component overflow-hidden w-full p-4 box-border hover:bg-[#21212114] ',
              {
                open: isOpen,
                close: !isOpen,
              }
            )}
          >
            <Link href={href} scroll={false} key={index}>
              <div className="question ">
                <div className="index">{`0${index}`}</div>
                <div className="question">{data.question}</div>
                <div className={'status-icon '}>
                  <div
                    className={clsx(
                      ' transition-all duration-200 flex items-center justify-center w-[14px] h-[14px] sm:w-6 sm:h-6',
                      {
                        '-rotate-45': !isOpen,
                      }
                    )}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
                        fill="#212121"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            {isOpen && <div className="answer">{data.answer}</div>}
          </div>
        );
      })}
    </div>
  );
};
export default FaqAsvab;
