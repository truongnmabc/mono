"use client";

import LazyLoadImage from "@/components/images";
import { useEffect, useState } from "react";

export const DmcaIcon = () => {
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.origin);
        }
    }, []);
    const dmcaId = "df1ce6f7-76b8-4c3f-b579-3b8afe3ea8aa";
    const protectionUrl = `https://www.dmca.com/Protection/Status.aspx?ID=${dmcaId}&refurl=${currentUrl}`;
    const badgeUrl = `https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=${dmcaId}`;

    return (
        <div className="h-6">
            <a href={protectionUrl} target="_blank" rel="noopener noreferrer">
                <LazyLoadImage
                    alt="DMCA.com Protection Status"
                    src={badgeUrl}
                    classNames="h-full object-contain"
                />
            </a>
        </div>
    );
};
