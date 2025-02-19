"use client";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppSelector } from "@/redux/hooks";
import getCountryAPI from "@/utils/getCountryAPI";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import { getAdClientId } from "./utils";

type IRes = {
    country: string;
};
const AdsSense = () => {
    const userInfo = useAppSelector(selectUserInfo);
    const [shouldShowAds, setShouldShowAds] = useState(false);
    const clientId = useRef("");
    useEffect(() => {
        const checkConditions = async () => {
            const adClient = getAdClientId();
            const result = (await getCountryAPI()) as IRes;
            if (adClient && result.country !== "VN") {
                clientId.current = adClient;
                setShouldShowAds(true);
            }
        };
        if (!userInfo.isPro) checkConditions();
    }, [userInfo]);

    if (!shouldShowAds) {
        return null;
    }
    return (
        <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId.current}`}
        />
    );
};

export default React.memo(AdsSense);
