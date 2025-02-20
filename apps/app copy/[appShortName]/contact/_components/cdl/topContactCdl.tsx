"use client";
import { IAppInfo } from "@/models/app/appInfo";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { Fragment, RefObject } from "react";
import { SocialsIcon } from "..";
import "./style.scss";
import LazyLoadImage from "@/components/images";
const TopContactCdl = ({
    emailSupport,
    appInfo,
    valueSendMail,
    onChangeEmail,
    checkEmailExist,
    onChangeMessage,
    checkMessageExist,
    handleSubmit,
    btn,
}: {
    emailSupport: string;
    appInfo: IAppInfo;
    valueSendMail: {
        email: string;
        message: string;
    };
    onChangeEmail: React.ChangeEventHandler<HTMLInputElement>;
    checkEmailExist: boolean;
    onChangeMessage: React.ChangeEventHandler<HTMLTextAreaElement>;
    checkMessageExist: boolean;
    handleSubmit: () => void;
    btn: RefObject<HTMLButtonElement>;
}) => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const router = useRouter();
    const layoutSendMail = () => {
        return (
            <div className="cluster-send-mail-cdl">
                <div className="form-send-mail">
                    <div className="title">Contact Us</div>
                    <div className="description">
                        Any questions, comments or feedback? We’re here to help!
                    </div>

                    <div className="input-mail">
                        <p>Email</p>
                        <div className="group-input-noti">
                            <input
                                type="text"
                                name="email"
                                value={valueSendMail.email}
                                onChange={onChangeEmail}
                                placeholder="Enter your email"
                            />
                            <div
                                className={
                                    "noti " + (!checkEmailExist ? "check" : "")
                                }
                            >
                                Please provide a valid email address!
                            </div>
                        </div>
                    </div>
                    <div className="input-message">
                        <p>Message</p>
                        <div className="group-textarea-noti">
                            <textarea
                                className="message-send-mail"
                                id="message-send-mail"
                                placeholder="Enter your message"
                                value={valueSendMail.message}
                                onChange={onChangeMessage}
                            ></textarea>
                            <div
                                className={
                                    "noti " +
                                    (!checkMessageExist ? "check" : "")
                                }
                            >
                                Please type your message!
                            </div>
                        </div>
                    </div>

                    <button ref={btn} onClick={() => handleSubmit()}>
                        Send
                    </button>
                    {!isMobile ? (
                        <LazyLoadImage
                            src="/images/contacts/cdl/form-contact-send-mail.png"
                            alt=""
                        />
                    ) : (
                        <>
                            <div className="contact-information">
                                Contact Information
                            </div>
                            <div className="intro">
                                We’re always happy to hear from you!
                            </div>
                            {emailSupport && (
                                <div
                                    className="cluster-email"
                                    onClick={() => {
                                        router.push(`mailto:${emailSupport}`);
                                    }}
                                >
                                    <LazyLoadImage
                                        src="/images/contacts/sms.png"
                                        alt=""
                                    />

                                    <div className="text-info">
                                        {emailSupport}
                                    </div>
                                </div>
                            )}
                            <SocialsIcon appName={appInfo.appName} />
                        </>
                    )}
                    {}
                </div>
            </div>
        );
    };
    return (
        <Fragment>
            {!isMobile && (
                <div className="in-form-cdl max-w-component-desktop">
                    <div className="left-form">
                        <LazyLoadImage
                            classNames="img-back"
                            src="/images/contacts/cdl/truck-contact-page.png"
                            alt=""
                        />
                        <div className="cluster-img-info">
                            <div className="title">Contact Information</div>
                            <div className="intro">
                                We’re always happy to hear from you!
                            </div>
                            {emailSupport && (
                                <div
                                    className="cluster-email"
                                    onClick={() => {
                                        router.push(`mailto:${emailSupport}`);
                                    }}
                                >
                                    <LazyLoadImage
                                        src="/images/contacts/sms.png"
                                        alt=""
                                        classNames="w-6 h-6"
                                    />

                                    <div className="text-info flex-1">
                                        {emailSupport}
                                    </div>
                                </div>
                            )}
                            <div
                                className="cluster-location"
                                onClick={() => {
                                    router.push("/");
                                }}
                            >
                                <LazyLoadImage
                                    src="/images/contacts/location.png"
                                    alt=""
                                    classNames="w-6 h-6"
                                />
                                <div className="text-info flex-1">
                                    209 S Rosemont Ave, Dallas, TX 75208
                                </div>
                            </div>

                            <SocialsIcon appName={appInfo.appName} />
                        </div>
                    </div>

                    {layoutSendMail()}
                </div>
            )}
            {isMobile && layoutSendMail()}
        </Fragment>
    );
};

export default TopContactCdl;
