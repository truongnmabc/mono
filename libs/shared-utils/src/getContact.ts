"use client";

import { IContactInfo, listContactApp } from "@shared-constants";

export const getContactApp = (appName: string): IContactInfo => {
    const lowerAppName = appName.toLowerCase();
    return (
        listContactApp[lowerAppName] || {
            facebook: "",
            youtube: "",
            twitter: "",
            linkedin: "",
            instagram: "",
        }
    );
};
