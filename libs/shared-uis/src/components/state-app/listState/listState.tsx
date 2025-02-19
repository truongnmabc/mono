"use client";

import { MtUiButton } from "@/components/button";
import MyContainer from "@/components/container";
import statesData from "@/data/statesName.json";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IAppInfo } from "@/models/app/appInfo";
// import { revertPathName } from "@/utils/pathName";
import { Collapse, Dialog } from "@mui/material";
// import { useRouter } from "next/navigation";
import "./ListState.scss";

interface State {
    id: number;
    name: string;
    tag: string;
}

interface StatesData {
    [key: string]: State[];
}

const states: StatesData = statesData;

const ListState = ({
    appInfo,
    openListState,
    setOpenListState,
}: {
    appInfo: IAppInfo;
    openListState: boolean;
    setOpenListState: (e: boolean) => void;
}) => {
    const isMobile = useIsMobile();
    const onClose = () => setOpenListState(false);

    // const router = useRouter();

    const handleNavigateState = (state: string) => {
        localStorage.setItem("select-state-" + appInfo.appNameId, state);
        // *NOTE : bo commet sau

        // const _href = revertPathName({
        //     state: state,
        //     appName: appInfo.appShortName,
        // });
        // router.push(_href);
    };
    return isMobile ? (
        <Dialog open={openListState} onClose={onClose}>
            <div className="h-full overflow-auto ">
                {states[appInfo.appShortName].map((state, index) => (
                    <p
                        className="w-full text-center py-2 px-6 cursor-pointer text-sm font-semibold transition-all "
                        key={index}
                        onClick={() => {
                            handleNavigateState(state.tag);
                        }}
                    >
                        {state.name}
                    </p>
                ))}
            </div>
        </Dialog>
    ) : (
        <MyContainer className="py-4">
            <Collapse in={openListState} timeout="auto" unmountOnExit>
                <div className="w-full grid bg-[#212121b2] rounded-xl grid-cols-5 p-3 gap-2">
                    {states[appInfo.appShortName].map((state, index) => (
                        <p
                            onClick={() => {
                                handleNavigateState(state.tag);
                            }}
                            className="w-full text-center py-2 cursor-pointer text-sm font-semibold transition-all hover:text-white hover:bg-[#ffffff1f] text-[#ffffffcc]"
                            key={index}
                        >
                            {state.name}
                        </p>
                    ))}
                </div>
                <div className="flex items-center mt-6 justify-center w-full">
                    <MtUiButton
                        onClick={onClose}
                        className="bg-[#212121f5] py-2 px-8 font-semibold text-xl text-white capitalize text-center rounded-md cursor-pointer "
                    >
                        Close
                    </MtUiButton>
                </div>
            </Collapse>
        </MyContainer>
    );
};

export default ListState;
