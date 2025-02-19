"use client";
import CloseIcon from "@/asset/icon/CloseIcon";
import IconLinkStoreApp from "@/components/iconLinkStoreApp";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import RouterApp from "@/constants/router.constant";
import { trackingEventGa4 } from "@/services/googleEvent";
import { Drawer } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import ItemDrawerFullTest from "./itemDrawer";
import ListStudyDrawer from "./listStudy";
import { useIsMobile } from "@/hooks/useIsMobile";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import { selectUserInfo } from "@/redux/features/user.reselect";

type IList = {
    handleClick: () => void;
    name: string;
};

const FN = ({
    openMenuDrawer,
    setOpenMenuDrawer,
}: {
    openMenuDrawer: boolean;
    setOpenMenuDrawer: (e: boolean) => void;
}) => {
    const appInfo = useAppSelector(selectAppInfo);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(selectUserInfo);

    const isMobile = useIsMobile();
    const list: IList[] = [
        ...(isMobile
            ? [
                  {
                      name: "Review",
                      handleClick: () => {
                          setOpenMenuDrawer(false);
                          router.push(RouterApp.Review);
                      },
                  },
              ]
            : []),
        {
            name: "Score Calculator",
            handleClick: () => {
                setOpenMenuDrawer(false);
                router.push(RouterApp.Score_Calculator);
            },
        },
        {
            name: "Study Guides",
            handleClick: () => {
                setOpenMenuDrawer(false);
                router.push(RouterApp.Study_Guides);
            },
        },
        {
            name: "Blog",
            handleClick: () => {
                setOpenMenuDrawer(false);
                router.push(RouterApp.Blog);
            },
        },

        {
            name: "Contact",
            handleClick: () => {
                setOpenMenuDrawer(false);
                router.push(RouterApp.Contacts);
            },
        },
    ];

    return (
        <Drawer
            open={openMenuDrawer}
            onClose={() => setOpenMenuDrawer(false)}
            anchor="right"
            sx={{
                width: { xs: "300px", sm: "456px" }, // Sử dụng Material-UI breakpoints
                "& .MuiDrawer-paper": {
                    width: { xs: "300px", sm: "456px" },
                },
            }}
        >
            <div className="bg-theme-white flex flex-col   p-3 w-full h-full overflow-auto">
                <div
                    className="p-2 rounded-full cursor-pointer w-fit h-fit hover:bg-[#2121211f]"
                    onClick={() => setOpenMenuDrawer(false)}
                >
                    <CloseIcon color="rgba(0, 0, 0, 0.87)" />
                </div>
                <ItemDrawerFullTest
                    name={`Full ${appInfo?.appName} Practice Test`}
                    handleClick={() => {
                        setOpenMenuDrawer(false);

                        if (!userInfo.isPro) {
                            const _href = `${RouterApp.Get_pro}`;
                            router.push(_href);
                            return;
                        }
                        trackingEventGa4({
                            eventName: "click_menu_full_test",
                            value: {
                                from: window.location.href,
                            },
                        });
                        dispatch(initFinalTestThunk());
                        router.push(RouterApp.Final_test);
                    }}
                />

                <ListStudyDrawer setOpenMenuDrawer={setOpenMenuDrawer} />
                {list.map((item) => (
                    <ItemDrawerFullTest
                        key={item.name}
                        name={item.name}
                        handleClick={item.handleClick}
                    />
                ))}
                <div className="flex p-3 flex-col gap-2">
                    <p className="text-sm  font-normal">
                        Available on Android and Apple devices
                    </p>
                    <div className="flex items-center gap-2">
                        <IconLinkStoreApp
                            type="ios"
                            classNames="w-[120px] h-[35px] sm:w-[120px] sm:h-[35px]"
                        />
                        <IconLinkStoreApp
                            type="android"
                            classNames="w-[120px] h-[35px] sm:w-[120px] sm:h-[35px]"
                        />
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

const DrawerHeader = React.memo(FN);

export default DrawerHeader;
