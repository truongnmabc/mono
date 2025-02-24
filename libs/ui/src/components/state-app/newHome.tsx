import MyContainer from "@/components/container";
import { IAppInfo } from "@/models/app/appInfo";
import { ITestInfo } from "@/models/tests/tests";
import BannerHome from "./newHome/banner";
import Handbook from "./newHome/handBook";
import ListHome from "./newHome/list/list";
import SelectState from "./newHome/selectState";
import ListBlock from "./newHome/slider";
import { ITopicBase } from "@/models/topics/topicsProgress";

const NewHome = ({
    appInfo,
    listTopics,
    _state,
    tests,
}: {
    appInfo: IAppInfo;
    listTopics: ITopicBase[];
    tests: ITestInfo[];
    _state: string;
}) => {
    return (
        <div className="w-full h-full">
            <SelectState appInfo={appInfo} _state={_state} />
            <div>
                <MyContainer>
                    <div className="landing-title-0">
                        <div className="landing-title-11">
                            <h2 className="title-h1 pt-6 sm:pt-12">
                                <p className="text-2xl w-full sm:text-[40px] capitalize text-center font-bold sm:leading-[60px]">{`${_state} ${appInfo?.appName} Practice Test`}</p>
                            </h2>
                        </div>
                        <div className="landing-title-12">
                            <p className="text-sm sm:text-lg w-full font-normal text-center">
                                Ace all {_state} DMV written tests with our two
                                powerful systems:{" "}
                                <br className="hidden sm:block" />
                                Master part by part in{" "}
                                <span className="font-semibold">
                                    Practice mode
                                </span>{" "}
                                and experience the real test atmosphere in{" "}
                                <span className="font-semibold">Test mode</span>
                            </p>
                        </div>
                    </div>
                    <ListHome
                        appInfo={appInfo}
                        _state={_state}
                        listTopics={listTopics}
                        tests={tests}
                    />
                </MyContainer>

                <ListBlock appInfo={appInfo} _state={_state} />
                <BannerHome appInfo={appInfo} _state={_state} />
                <Handbook appInfo={appInfo} _state={_state} />
            </div>
        </div>
    );
};

export default NewHome;
