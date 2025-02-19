"use client";
import { useEffect } from "react";
import { API_PATH } from "@/constants/api.constants";
import { IAppInfo } from "@/models/app/appInfo";
import { useDispatch } from "react-redux";
import { setIsDataFetched } from "@/redux/features/appInfo";

const ServiceWorkerInit = ({ appInfo }: { appInfo: IAppInfo }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleInit = async () => {
            if ("serviceWorker" in navigator && appInfo.appShortName) {
                try {
                    const registration = await navigator.serviceWorker.register(
                        "/sw.js"
                    );

                    // Kiểm tra nếu service worker đã active
                    let activeWorker = registration.active;

                    if (!activeWorker && registration.waiting) {
                        activeWorker = registration.waiting;
                    } else if (!activeWorker && registration.installing) {
                        activeWorker = registration.installing;
                    }

                    if (activeWorker) {
                        // Nếu đã có worker active hoặc đang cài đặt
                        activeWorker.addEventListener("statechange", () => {
                            if (activeWorker.state === "activated") {
                                console.log("Service Worker activated!");
                                initializeDB(activeWorker);
                            }
                        });

                        // Nếu active ngay lập tức
                        if (activeWorker.state === "activated") {
                            console.log("Service Worker is already activated!");
                            initializeDB(activeWorker);
                        }
                    }
                } catch (error) {
                    console.error("Service Worker registration failed:", error);
                }
            }
        };

        const initializeDB = (worker: ServiceWorker) => {
            const messageChannel = new MessageChannel();

            messageChannel.port1.onmessage = (event) => {
                if (event.data.status === "success") {
                    console.log("Message:", event.data.message);
                    dispatch(setIsDataFetched(true));
                } else {
                    console.error("Failed to initialize DB.");
                }
            };

            worker.postMessage(
                {
                    type: "INIT_DB",
                    payload: {
                        appShortName: appInfo.appShortName,
                        apiPath: API_PATH,
                    },
                },
                [messageChannel.port2]
            );
        };

        handleInit();
    }, [appInfo.appShortName, dispatch]);

    return null;
};

export default ServiceWorkerInit;
