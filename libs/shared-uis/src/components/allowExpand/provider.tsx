import { ITopicBase } from "@/models/topics/topicsProgress";
import React, { ReactNode } from "react";

export interface IContextAllowExpand {
    color?: string;
    mainTopic?: ITopicBase | null;
    mainTopicTag: string | null;
}

export const AllowExpandContext = React.createContext<IContextAllowExpand>({
    color: "red",
    mainTopic: undefined,
    mainTopicTag: "",
});

const AllowExpandProvider = ({
    children,
    topic,
}: {
    children: ReactNode;
    topic: ITopicBase | null;
}) => {
    const value = {
        mainTopic: topic,
        mainTopicTag: topic ? topic.tag : "",
    };

    return (
        <AllowExpandContext.Provider value={value}>
            {children}
        </AllowExpandContext.Provider>
    );
};
export default AllowExpandProvider;
