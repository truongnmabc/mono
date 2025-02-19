import LazyLoadImage from "@/components/images";
import WrapperProPage from "./_components/wrapperProPage";
import TitleGetPro from "./_components/titleGetPro";
import TotalQuestion from "./_components/totalQuestion";
import StoreLogoV4 from "./_components/storeLogo/storeLogoUpPro";
import ProPackage from "./_components/proPackage";

const Page = () => {
    return (
        <WrapperProPage>
            <div className="bg-[url('/images/passemall/background-pro.png')] bg-right bg-no-repeat bg-cover bg-[#14674a] pb-8 ">
                <div className="max-w-page mx-auto">
                    <h1
                        style={{
                            textShadow: "0px 1px 8px #59f5a9",
                        }}
                        className="text-white text-4xl sm:text-5xl lg:text-[58px] lg:leading-[86px] text-center font-medium capitalize pt-6 sm:pt-8 px-4"
                    >
                        Pass for the first time <small>with</small>{" "}
                        <TitleGetPro />
                        Plan
                    </h1>

                    <div className="flex mt-3 sm:mt-5 justify-center">
                        <div className="w-fit">
                            <div className="flex items-center gap-2 text-sm  sm:text-base lg:text-lg capitalize text-center text-white">
                                <LazyLoadImage
                                    classNames="w-8 h-8 sm:w-10 sm:h-10 lg:w-[50px] lg:h-[50px] "
                                    src="/images/passemall/new-pro/Checkbox.png"
                                />
                                Unlock Detailed Explanations
                            </div>
                            <TotalQuestion />

                            <div className="flex items-center gap-2 lg:text-lg text-sm sm:text-base capitalize text-center text-white">
                                <LazyLoadImage
                                    classNames="w-8 h-8 sm:w-10 sm:h-10 lg:w-[50px] lg:h-[50px]"
                                    src="/images/passemall/new-pro/Checkbox.png"
                                />
                                Remove All Disturbing Ads
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 sm:mt-9 lg:mt-12 lg:py-6 sm:py-9 py-4  flex items-center  bg-[#2121213d]">
                    <div className="max-w-page mx-auto px-2">
                        <StoreLogoV4 />
                    </div>
                </div>
            </div>

            <div className="packages mt-8 bg-white" id="app-pro-package">
                <ProPackage />
            </div>
            <div className="w-full bg-white max-w-page mx-auto mt-8">
                <p className="text-sm font-normal text-center max-w-[1150px] px-4 mt-6 text-[#21212185] sm:mb-20 mb-6 ">
                    Subscriptions auto-renew at the cost of the chosen package,
                    unless cancelled 24 hours in advance of the end of the
                    current period. The subscription fee is charged to your
                    PayPal account upon purchase. You may manage your
                    subscription and turn off auto-renewal by accessing your
                    Account Settings after purchase. Per our policy, you cannot
                    cancel your current subscription during the active
                    subscription period. No refunds will be provided for any
                    unused portion of the subscription term.
                </p>
            </div>
        </WrapperProPage>
    );
};

export default Page;
