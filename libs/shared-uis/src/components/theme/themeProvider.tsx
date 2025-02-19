"use client";

import { appConfigState } from "@/redux/features/appConfig";
import { useAppSelector } from "@/redux/hooks";
import { createTheme, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useLayoutEffect } from "react";
// import mediaQuery from "css-mediaquery";
export type ThemeMode = "light" | "dark" | "system";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { appConfig } = useAppSelector(appConfigState);
    const theme =
        (typeof localStorage !== "undefined" &&
            (localStorage?.getItem("theme") as ThemeMode)) ||
        "light";

    // const ssrMatchMedia = (query: string) => ({
    //     matches: mediaQuery.match(query, {
    //         // The estimated CSS width of the browser.
    //         width: 768,
    //     }),
    // });

    const muiTheme = createTheme({
        palette: {
            primary: {
                main: "rgba(252, 167, 45, 1)",
            },
            mode: "light",
        },
        // components: {
        //     MuiUseMediaQuery: {
        //         // defaultProps: {
        //         //     ssrMatchMedia,
        //         // },
        //         defaultProps: {
        //             noSsr: true,
        //         },
        //     },
        // },
    });

    useLayoutEffect(() => {
        if (appConfig) {
            // setup property ở đây, các thuộc tính màu sẽ thay đổi theo app
            const root = window.document.documentElement;
            root.style.setProperty(
                "--main-background-color",
                appConfig.mainBackgroundColor
            );

            // root.style.setProperty(
            //     "--text-color-primary",
            //     appConfig.mainBackgroundColor
            // );

            root.style.setProperty("--main-color", appConfig.mainColor);

            root.style.setProperty(
                "--main-color-bold",
                appConfig.mainColorBold
            );
            root.style.setProperty(
                "--main-back-color-contact",
                appConfig.mainBackgroundColorContact
            );
            root.style.setProperty(
                "--main-linear-gradient-banner-download",
                appConfig.linearGradientBanner
            );
        }
    }, [appConfig]);

    useLayoutEffect(() => {
        const root = window.document.body;

        if (theme === "dark") {
            root.classList.add("dark");
        }
        if (theme === "light") {
            root.classList.remove("dark");
        }
        if (theme === "system") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            if (mediaQuery.matches) {
                root.classList.add("dark");
            }

            const handleChange = (e: MediaQueryListEvent) => {
                if (e.matches) {
                    root.classList.add("dark");
                } else {
                    root.classList.remove("dark");
                }
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
        return undefined;
    }, [theme]);

    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={muiTheme}>
                {children}
                <CssBaseline />
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
};

export default AppThemeProvider;
