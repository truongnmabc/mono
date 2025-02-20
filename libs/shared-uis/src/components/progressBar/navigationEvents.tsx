"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useProgressBar } from "./progressBar";

export function NavigationEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { start, done } = useProgressBar();
    const router = useRouter();

    const _push = router.push.bind(router);
    const _replace = router.push.bind(router);

    router.push = (href, options) => {
        start();
        _push(href, options);
    };

    router.push = (href, options) => {
        start();
        _replace(href, options);
    };
    useEffect(() => {
        done();
    }, [pathname, searchParams]);

    return null;
}
