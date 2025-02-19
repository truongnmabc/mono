import React from "react";

const SeoContent = ({ content }: { content: string }) => {
    return (
        <div
            className="html-content-revert"
            dangerouslySetInnerHTML={{
                __html: (content ?? "").replace(/\[/g, "<").replace(/\]/g, ">"),
            }}
        />
    );
};
export default React.memo(SeoContent);
