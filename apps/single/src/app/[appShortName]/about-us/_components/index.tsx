"use client";
import LazyLoadImage from "@/components/images";
import { IAppInfo } from "@/models/app/appInfo";
import { IMember } from "@/models/memberContact/member";
import { getMemberApi } from "@/services/contact.service";
import "@/styles/slick-theme.min.css";
import "@/styles/slick.css";
import "@/styles/slick.min.css";
import { useEffect, useState } from "react";
import ActivityComponent from "./asvab/activity";
import HeaderComponent from "./asvab/header";
import AboutHeaderCdl from "./cdl/header";
import AboutActivityCdl from "./cdl/header/activity";
import "./index.scss";

const AboutUsContainer = ({ appInfo }: { appInfo: IAppInfo }) => {
    const [listMember, setListMember] = useState<IMember[]>([]);
    useEffect(() => {
        const fetchMembers = async () => {
            let baseUrl = "";
            switch (appInfo.appShortName) {
                case "cdl":
                    baseUrl = "https://cdl-prep.com";
                    break;
                case "asvab":
                    baseUrl = "https://asvab-prep.com";
                    break;
            }
            const members: IMember[] = await getMemberApi(baseUrl);
            setListMember(handleMember(members, appInfo.appShortName));
        };
        fetchMembers();
    }, [appInfo.appShortName]);

    const showProfileMember = (memberNameSlug: string) => {
        window.open(`https://cdl-prep.com/author/${memberNameSlug}`, "_blank");
    };
    const renderHeaderAbout = () => {
        switch (appInfo.appName.toLocaleLowerCase()) {
            case "cdl":
                return <AboutHeaderCdl />;
            case "asvab":
                return <HeaderComponent appInfo={appInfo} />;
            default:
                return null;
        }
    };
    const renderActivityAbout = () => {
        switch (appInfo.appName.toLocaleLowerCase()) {
            case "cdl":
                return <AboutActivityCdl />;
            case "asvab":
                return <ActivityComponent />;

            default:
                return null;
        }
    };
    return (
        <div className="about-us-container">
            {renderHeaderAbout()}

            <div className="about-us-bottom">
                {renderActivityAbout()}
                <div className="meet-the-team max-w-component-desktop">
                    <div className="title-meet-the-team">Meet The Team</div>
                    <div className="members">
                        {listMember.map((item, index) => (
                            <div className="info-member" key={index}>
                                <div
                                    className="avatar"
                                    onClick={() => {
                                        showProfileMember(item.user_nicename);
                                    }}
                                >
                                    <LazyLoadImage src={item.avatar} alt="" />
                                </div>
                                <div
                                    className="name"
                                    onClick={() => {
                                        showProfileMember(item.user_nicename);
                                    }}
                                >
                                    {item.name}
                                </div>
                                <div className="position">{item.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const handleMember = (memberQueryWp: IMember[], appShortName: string) => {
    const listDataAsvab: IMember[] = [
        {
            ID: 100,
            username: "samantha@gmail.com",
            email: "samantha@gmail.com",
            name: "Samantha Johnson",
            role: "Project Manager",
            avatar: "/images/about/samantha.png",
            user_nicename: "samantha",
        },
        {
            ID: 101,
            username: "alex@gmail.com",
            email: "alex@gmail.com",
            name: "Alex Rodriguez",
            role: "Lead Web Developer",
            avatar: "/images/about/alex.png",
            user_nicename: "alex",
        },
        {
            ID: 102,
            username: "lucas@gmail.com",
            email: "lucas@gmail.com",
            name: "Lucas Clark",
            role: "Lead App Developer",
            avatar: "/images/about/lucas.png",
            user_nicename: "lucas",
        },
        {
            ID: 103,
            username: "michael@gmail.com",
            email: "michael@gmail.com",
            name: "Michael Wilson",
            role: "ASVAB Subject Matter Expert",
            avatar: "/images/about/michael.png",
            user_nicename: "michael",
        },
        {
            ID: 104,
            username: "mason@gmail.com",
            email: "mason@gmail.com",
            name: "Mason Taylor",
            role: "ASVAB Assessment Specialist",
            avatar: "/images/about/mason.png",
            user_nicename: "mason",
        },
        {
            ID: 105,
            username: "sarah@gmail.com",
            email: "sarah@gmail.com",
            name: "Sarah Wilson",
            role: "Content Manager",
            avatar: "/images/about/sarah.png",
            user_nicename: "sarah",
        },
        {
            ID: 106,
            username: "oceanites@gmail.com",
            email: "oceanites@gmail.com",
            name: "Oceanites Nguyen",
            role: "Content Writer",
            avatar: "/images/about/oceanites.png",
            user_nicename: "oceanites",
        },
        {
            ID: 107,
            username: "cloudy@gmail.com",
            email: "cloudy@gmail.com",
            name: "Cloudy Nguyen",
            role: "Content Writer",
            avatar: "/images/about/cloudy.png",
            user_nicename: "cloudy",
        },
        {
            ID: 108,
            username: "amy@gmail.com",
            email: "amy@gmail.com",
            name: "Amy Duong",
            role: "Content Writer",
            avatar: "/images/about/amy.png",
            user_nicename: "amy",
        },
        {
            ID: 109,
            username: "olivia@gmail.com",
            email: "olivia@gmail.com",
            name: "Olivia Gonzalez",
            role: "UI/UX Designer",
            avatar: "/images/about/olivia.png",
            user_nicename: "olivia",
        },
        {
            ID: 110,
            username: "jennifer@gmail.com",
            email: "jennifer@gmail.com",
            name: "Jennifer Williamson",
            role: "Editor",
            avatar: "/images/about/jennifer.png",
            user_nicename: "jennifer",
        },
        {
            ID: 111,
            username: "thomas@gmail.com",
            email: "thomas@gmail.com",
            name: "Thomas Perez",
            role: "Quality Assurance Tester",
            avatar: "/images/about/thomas.png",
            user_nicename: "thomas",
        },
    ];
    const listMember: IMember[] = [
        {
            ID: 100,
            username: "mason-scott@gmail.com",
            email: "mason-scott@gmail.com",
            name: "Mason Scott",
            role: "Project Manager",
            avatar: "/images/about/avatar-mason-scott.png",
            user_nicename: "mason-scott",
        },
        {
            ID: 101,
            username: "alex-martinez@abc-elearning.org",
            email: "alex-martinez@abc-elearning.org",
            name: "Alex Martinez",
            role: "Lead CDL Instructor",
            avatar: "/images/about/avatar-alex-martinez.png",
            user_nicename: "alex-martinez",
        },
        {
            ID: 102,
            username: "james-roberts",
            email: "james-roberts@abc-elearning.org",
            name: "James Roberts",
            role: "Lead Web Developer",
            avatar: "/images/about/avatar-james-roberts.png",
            user_nicename: "james-roberts",
        },
        {
            ID: 103,
            username: "lili-nguyen",
            email: "lili-nguyen@abc-elearning.org",
            name: "Lili Nguyen",
            role: "Content Manager",
            avatar: "/images/about/avatar-lili-nguyen.png",
            user_nicename: "lili-nguyen",
        },
        {
            ID: 104,
            username: "lena-nguyen",
            email: "lena-nguyen@gmail.com",
            name: "Lena Nguyen",
            role: "Content Writer",
            avatar: "/images/about/avatar-lena-nguyen.png",
            user_nicename: "lena-nguyen",
        },
        {
            ID: 105,
            username: "alina-duong",
            email: "alina-duong@gmail.com",
            name: "Alina Duong",
            role: "Content Writer",
            avatar: "/images/about/avatar-alina-duong.png",
            user_nicename: "alina-duong",
        },
        {
            ID: 106,
            username: "morgan-davis",
            email: "morgan-davis@gmail.com",
            name: "Morgan Davis",
            role: "Designer",
            avatar: "/images/about/avatar-morgan-davis.png",
            user_nicename: "morgan-davis",
        },
        {
            ID: 107,
            username: "riley-anderson",
            email: "riley-anderson@gmail.com",
            name: "Riley Anderson",
            role: "Content Writer",
            avatar: "/images/about/avatar-riley-anderson.png",
            user_nicename: "riley-anderson",
        },
        {
            ID: 108,
            username: "sarah-patel",
            email: "sarah-patel@gmail.com",
            name: "Sarah Patel",
            role: "Quality Assurance (QA) Specialist",
            avatar: "/images/about/avatar-sarah-patel.png",
            user_nicename: "sarah-patel",
        },
    ];
    const mapB = new Map(
        memberQueryWp.map((item) => {
            if (item.role == "editor") {
                return [item.name, { ...item, role: "Content Writer" }];
            } else {
                return [item.name, item];
            }
        })
    );
    const mergeArray = listMember.map((item) => {
        if (mapB.has(item.name)) {
            const updatedItem = { ...item, ...mapB.get(item.name) };
            mapB.delete(item.name);
            return updatedItem;
        }
        return item;
    });
    const remainingFromB = Array.from(mapB.values());
    switch (appShortName) {
        case "cdl":
            return [...mergeArray, ...remainingFromB];
        case "asvab":
            return listDataAsvab;
        default:
            return listDataAsvab;
    }
};
export default AboutUsContainer;
