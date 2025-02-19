import LazyLoadImage from "@/components/images";
import MyContainer from "@/components/container";
import { IAppInfo } from "@/models/app/appInfo";
import React from "react";

const Handbook = ({
    appInfo,
    _state,
}: {
    appInfo: IAppInfo;
    _state: string;
}) => {
    return (
        <MyContainer className="pb-12 sm:pb-[120px]">
            <h3 className="sm:pt-6 mt-4 text-lg px-6 sm:px-0 text-center sm:text-start font-medium sm:text-2xl sm:font-semibold ">
                Study with the <span className="capitalize">{_state}</span>{" "}
                <span className=" uppercase">{appInfo?.appShortName}</span>{" "}
                handbook
            </h3>

            <div
                className="sm:mt-6 mt-4 h-fit flex flex-col-reverse sm:flex-row rounded-2xl"
                style={{
                    background:
                        "linear-gradient(90deg, #D8DEFF 0%, #EED8FF 100%)",
                }}
            >
                <div className="flex-1 sm:p-6 p-4">
                    <p className="text-sm text-[#212121CC] sm:text-[#212121] sm:text-xl font-normal">
                        Your perfect study companion! This intensive{" "}
                        <span className="font-semibold">
                            <span className=" uppercase">
                                {appInfo?.appShortName}
                            </span>{" "}
                            handbook
                        </span>{" "}
                        is packed with all{" "}
                        <span className="capitalize">{_state}</span>{" "}
                        <span className=" uppercase">
                            {appInfo?.appShortName}
                        </span>{" "}
                        rules, regulations, and helpful tips, taking you closer
                        to your{" "}
                        <span className=" uppercase">
                            {appInfo?.appShortName}
                        </span>{" "}
                        dream.
                    </p>
                    <ul className="flex sm:flex-row flex-col gap-4 pl-6 mt-4 list-disc">
                        <li className="text-base mr-4 font-normal">
                            Comprehensive coverage
                        </li>
                        <li className="text-base  mr-4 font-normal">
                            Easy to navigate
                        </li>
                        <li className="text-base  mr-4 font-normal">
                            100% free & accessible
                        </li>
                    </ul>
                    <button className="sm:h-14  h-12 px-8 w-full sm:w-fit  hover:opacity-80 hover:bg-slate-400  rounded-lg mt-6 bg-white border border-solid border-[#343F82]">
                        <div className="flex items-center w-full sm:w-fit text-[#343F82] text-base font-semibold justify-center gap-1">
                            Explore Handbook
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.3998 9.88079L10.8098 5.29079C10.6224 5.10454 10.369 5 10.1048 5C9.84062 5 9.58716 5.10454 9.3998 5.29079C9.30607 5.38376 9.23168 5.49436 9.18091 5.61622C9.13014 5.73808 9.104 5.86878 9.104 6.00079C9.104 6.1328 9.13014 6.26351 9.18091 6.38537C9.23168 6.50723 9.30607 6.61783 9.3998 6.71079L13.9998 11.2908C14.0935 11.3838 14.1679 11.4944 14.2187 11.6162C14.2695 11.7381 14.2956 11.8688 14.2956 12.0008C14.2956 12.1328 14.2695 12.2635 14.2187 12.3854C14.1679 12.5072 14.0935 12.6178 13.9998 12.7108L9.3998 17.2908C9.2115 17.4778 9.10518 17.7319 9.10425 17.9973C9.10331 18.2626 9.20783 18.5175 9.3948 18.7058C9.58178 18.8941 9.8359 19.0004 10.1013 19.0014C10.3666 19.0023 10.6215 18.8978 10.8098 18.7108L15.3998 14.1208C15.9616 13.5583 16.2772 12.7958 16.2772 12.0008C16.2772 11.2058 15.9616 10.4433 15.3998 9.88079Z"
                                    fill="#343F82"
                                />
                            </svg>
                        </div>
                    </button>
                </div>
                <LazyLoadImage
                    src={"/images/cdl_v2/home/Rectangle.png"}
                    classNames="sm:w-[300px] sm:h-[228px] w-full rounded-lg"
                    imgClassNames="object-cover w-full"
                />
            </div>
        </MyContainer>
    );
};

export default Handbook;
