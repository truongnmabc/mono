import React from "react";
import { IFAQData } from "../body";
import BoxFAQComponent from "../body/box-faq";

const FaqAsvab = () => {
    const FAQDataAsvab: IFAQData[] = [
        {
            question:
                "Do the ASVAB Prep questions appear on the official test?",
            answer: "The questions may not be an exact replica of the exam questions, but they closely follow the content covered in the real exam. By practicing with our questions, learners can develop a strong understanding of the concepts and topics that are essential for success in the real exam.",
        },
        {
            question: "How does my account sync between the app and the web?",
            answer: "Please log in to the app/web by our login feature with the same email that was registered with the PRO version so that all the data and progress can be synchronized.",
        },
        {
            question: "How do I cancel subscriptions?",
            answer: <AnswerIndex2Component />,
        },
        {
            question:
                "Can I use the ASVAB Prep test result as the Standard Score?",
            answer: "No. While our ASVAB Prep test is designed to mirror the actual ASVAB in content and format closely, it is intended solely as a practice tool to help learners prepare and familiarize themselves with the test. The results from our practice tests, while useful for gauging one's progress, do not carry the same weight or recognition as the official ASVAB standard score.",
        },
        {
            question: "Can I change to another language?",
            answer: "No. At the moment, our platform only has an English language version available. Our development team is actively reviewing the feasibility and timeline for adding new language options in the future.",
        },
        {
            question: "How can I request a refund?",
            answer: <AnswerIndex5Component />,
        },
    ];
    return (
        <>
            {FAQDataAsvab.map((data, index) => (
                <BoxFAQComponent key={index} index={index} data={data} />
            ))}
        </>
    );
};
const AnswerIndex2Component = () => {
    return (
        <>
            <div>If you are using our website:</div>
            <ul>
                <li>
                    At the homepage, click on your avatar, then choose
                    `&quot;Billing History`&quot;.
                </li>
                <li>
                    All your subscriptions will show up and you can cancel
                    anytime you want.
                </li>
            </ul>
            <div>
                If you are using our application, the cancellation depends on
                the terms of IOS or Android. Please access these links for more
                information:
            </div>
            <ul>
                <li>
                    The terms of use:{" "}
                    <a
                        href="https://abc-elearning-app.github.io/terms-of-use/index.html"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        target="__blank"
                        rel="nofollow"
                    >
                        https://abc-elearning-app.github.io/terms-of-use/index.html
                    </a>
                </li>
                <li>
                    Cancellation for IOS:{" "}
                    <a
                        href="https://support.apple.com/en-vn/HT202039"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        target="__blank"
                    >
                        https://support.apple.com/en-vn/HT202039
                    </a>
                </li>
                <li>
                    Cancellation for Android:{" "}
                    <a
                        href="https://support.google.com/googleplay/answer/7018481?hl=en&co=GENIE.Platform%3DAndroid"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        target="__blank"
                    >
                        https://support.google.com/googleplay/answer/7018481?hl=en&co=GENIE.Platform%3DAndroid
                    </a>
                </li>
            </ul>
        </>
    );
};

const AnswerIndex5Component = () => {
    return (
        <ul className="answer-index-5">
            <li>
                If your purchase was made through our website: Please request a
                refund through PayPal, which is the payment processor for
                transactions on our site. You can initiate this process by
                following this link:{" "}
                <a
                    href="https://www.paypal.com/us/cshelp/article/how-do-i-get-a-refund-help100"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    target="__blank"
                >
                    PayPal Refund Support.
                </a>
            </li>
            <li>
                If your purchase was made through IOS: Apple handles all
                transactions and refunds made through the app, so they will be
                best equipped to assist you. Please request a refund through the
                Apple Store. You can initiate this process by following this
                link:{" "}
                <a
                    href="https://support.apple.com/en-vn/118223"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    target="__blank"
                >
                    Apple Refund Support
                </a>
            </li>
            <li>
                If your purchase was made through Android: Google handles all
                transactions and refund requests for purchases made through
                their platform. Please request a refund through Google Play. You
                can start the process by visiting this link:{" "}
                <a
                    href="https://support.google.com/googleplay/answer/2479637?visit_id=638581628161525400-2510090661&rd=1"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    target="__blank"
                >
                    Google Play Refund Support
                </a>
            </li>
        </ul>
    );
};
export default FaqAsvab;
