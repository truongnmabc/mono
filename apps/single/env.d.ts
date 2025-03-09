/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

declare namespace NodeJS {
    interface ProcessEnv {
        readonly APP_ID: string;
        readonly NEXT_PUBLIC_API_URL: string;
        readonly NEXT_PUBLIC_GOOGLE_ID: string;
        readonly IS_SINGLE_APP: string;
        readonly NEXT_PUBLIC_GA_ID: string;
        readonly NEXT_PUBLIC_GTM_ID: string;
        readonly DEV_BASE_API: string;
        readonly NEXT_PUBLIC_API_URL: string;
        readonly NEXT_PUBLIC_APP_SHORT_NAME: string;
    }
}
