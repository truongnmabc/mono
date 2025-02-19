function getAdClientId() {
    return "ca-pub-3656400522603089"; // cdl, passemall, teas, ged,cna
}
type AdsIdMap = {
    LearnAdsMobileBeforeNavigation: string;
    BlogAdsRightSidebar: string;
    BlogAdsBeforeArticleList: string;
    LearnAdsLeftSidebar: string;
    LearnAdsAfterHeader: string;
    LearnAdsBottom: string;
    TestAdsAfterHeader: string;
    TestAdsLeftSidebar: string;
    TestAdsBottom: string;
    HomeAdsAfterTopics: string;
    HomeAdsAfterTests: string;
};

function getAdsId(name: keyof AdsIdMap): string | undefined {
    const adsIdMap: AdsIdMap = {
        LearnAdsMobileBeforeNavigation: "3453850342",
        BlogAdsRightSidebar: "7193784800",
        BlogAdsBeforeArticleList: "7570216992",
        LearnAdsLeftSidebar: "7712659551",
        LearnAdsAfterHeader: "2126318623",
        LearnAdsBottom: "5880455057",
        TestAdsAfterHeader: "9053413301",
        TestAdsLeftSidebar: "9053413301",
        TestAdsBottom: "9983351597",
        HomeAdsAfterTopics: "6818380284",
        HomeAdsAfterTests: "5143719422",
    };

    return adsIdMap[name];
}
export { getAdClientId, getAdsId };
