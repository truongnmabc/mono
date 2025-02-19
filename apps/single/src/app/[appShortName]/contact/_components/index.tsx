"use client";

import FacebookIcon from "@/components/icon/FacebookIcon";
import LinkedinIcon from "@/components/icon/LinkedinIcon";
import TwitterIcon from "@/components/icon/TwitterIcon";
import YoutubeIcon from "@/components/icon/YoutubeIcon";
import { IAppInfo } from "@/models/app/appInfo";
import { appConfigState } from "@/redux/features/appConfig";
import { useAppSelector } from "@/redux/hooks";
import { sendEmailSubscribeApiV4 } from "@/services/home.service";
import { validateEmail } from "@/utils";
import { getContactApp } from "@/utils/getContact";
import { useRef, useState } from "react";
import TopContactAsvab from "./asvab/topContactAsvab";
import BodyComponent from "./body";
import TopContactCdl from "./cdl/topContactCdl";
import "./index.scss";
const ContactsScreen = ({ appInfo }: { appInfo: IAppInfo }) => {
    const btn = useRef<HTMLButtonElement>(null);
    const [valueSendMail, setValueSendMail] = useState({
        email: "",
        message: "",
    });
    const [checkMessageExist, setCheckMessageExist] = useState(true);
    const [checkEmailExist, setCheckEmailExist] = useState(true);
    const emailSupport = "support@abc-elearning.org";
    const onChangeEmail = (e: { target: { value: string } }) => {
        if (e.target.value != "") {
            setCheckEmailExist(true);
        } else {
            setCheckEmailExist(false);
        }
        setValueSendMail({
            ...valueSendMail,
            email: e.target.value,
        });
    };
    const onChangeMessage = (e: { target: { value: string } }) => {
        if (e.target.value != "") {
            setCheckMessageExist(true);
        } else {
            setCheckMessageExist(false);
        }
        setValueSendMail({
            ...valueSendMail,
            message: e.target.value,
        });
    };
    const handleSubmit = async () => {
        if (btn.current) {
            let result;
            try {
                const email = valueSendMail.email;
                const message = valueSendMail.message;
                const isValidEmail = validateEmail(valueSendMail.email);
                const isValidMessage = message.trim().length > 0;
                if (!isValidMessage) {
                    setCheckMessageExist(false);
                }
                if (!isValidEmail || !email) {
                    setCheckEmailExist(false);
                }
                if (isValidEmail && isValidMessage) {
                    btn.current.innerHTML = "Sending...";
                    btn.current.disabled = true;

                    result = await sendEmailSubscribeApiV4(
                        email.trim(),
                        message.trim(),
                        appInfo.appName
                    );
                }
            } catch (error) {
                console.log("footer send mail error", error);
            }
            if (result) {
                btn.current.innerHTML = "Sent";
                setTimeout(() => {
                    if (btn.current) {
                        btn.current.disabled = false;
                        btn.current.innerHTML = "Send";
                    }
                }, 2000);
            }
        }
    };
    const renderTopContact = () => {
        switch (appInfo.appName.toLocaleLowerCase()) {
            case "cdl":
                return (
                    <TopContactCdl
                        emailSupport={emailSupport}
                        appInfo={appInfo}
                        valueSendMail={valueSendMail}
                        onChangeEmail={onChangeEmail}
                        checkEmailExist={checkEmailExist}
                        onChangeMessage={onChangeMessage}
                        checkMessageExist={checkMessageExist}
                        handleSubmit={handleSubmit}
                        btn={btn}
                    />
                );
            case "asvab":
                return (
                    <TopContactAsvab
                        emailSupport={emailSupport}
                        appInfo={appInfo}
                        valueSendMail={valueSendMail}
                        onChangeEmail={onChangeEmail}
                        checkEmailExist={checkEmailExist}
                        onChangeMessage={onChangeMessage}
                        checkMessageExist={checkMessageExist}
                        handleSubmit={handleSubmit}
                        btn={btn}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="contact-page">
            <div className="cluster-infor-title">{renderTopContact()}</div>
            <div className="cluster-faqs">
                <BodyComponent appInfo={appInfo} />
            </div>
        </div>
    );
};

export const SocialsIcon = ({ appName }: { appName: string }) => {
    const { appConfig } = useAppSelector(appConfigState);
    const { facebook, twitter, youtube, linkedin } = getContactApp(appName);

    return (
        <div className="socials-icon">
            {facebook && (
                <a href={facebook}>
                    <FacebookIcon
                        color="#fff"
                        colorApp={appConfig.mainColorBold}
                    />
                </a>
            )}
            {twitter && (
                <a href={twitter}>
                    <TwitterIcon
                        color="#fff"
                        colorApp={appConfig.mainColorBold}
                    />
                </a>
            )}
            {youtube && (
                <a href={youtube}>
                    <YoutubeIcon
                        color="#fff"
                        colorApp={appConfig.mainColorBold}
                    />
                </a>
            )}
            {linkedin && (
                <a href={linkedin}>
                    <LinkedinIcon
                        color="#fff"
                        colorApp={appConfig.mainColorBold}
                    />
                </a>
            )}
        </div>
    );
};

export default ContactsScreen;
