import React from "react";
import { IFAQData } from "../body";
import BoxFAQComponent from "../body/box-faq";

const FaqCDL = () => {
    const FAQDataCdl: IFAQData[] = [
        {
            question:
                "Do the CDL practice questions appear on the official test?",
            answer: "The questions may not be an exact replica of the exam questions, but they closely follow the content covered in the real exam. By practicing with our questions, learners can develop a strong understanding of the concepts and topics that are essential for success in the real exam.",
        },
        {
            question: "How does my account sync between the app and the web?",
            answer: "Please log in to the app/web by our login feature with the same email that was registered with the PRO version so that all the data and progress can be synchronized.",
        },
        {
            question: "Can I use the CDL Prep results for the real test?",
            answer: "No. While our CDL Prep test is designed to mirror the actual CDL in content and format closely, it is intended solely as a practice tool to help learners prepare and familiarize themselves with the test. The results from our practice tests, while useful for gauging one's progress, do not carry the same weight or recognition as the official test.",
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
            {FAQDataCdl.map((data, index) => (
                <BoxFAQComponent key={index} index={index} data={data} />
            ))}
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
                    target="_blank"
                >
                    PayPal Refund Support.
                </a>
            </li>
            <li>
                If your purchase was made through IOS: Apple handles all
                transactions and refunds made through the app, so they will be
                best equipped to assist you. Please request a refund through the
                Apple Store. You can initiate this process by following this
                link:
                <a
                    href="https://support.apple.com/en-vn/118223"
                    target="_blank"
                >
                    {" "}
                    Apple Refund Support
                </a>
            </li>
            <li>
                If your purchase was made through Android: Google handles all
                transactions and refund requests for purchases made through
                their platform. Please request a refund through Google Play. You
                can start the process by visiting this link:
                <a
                    href="https://support.google.com/googleplay/answer/2479637?visit_id=638581628161525400-2510090661&rd=1"
                    target="_blank"
                >
                    {" "}
                    Google Play Refund Support
                </a>
            </li>
        </ul>
    );
};
export default FaqCDL;
