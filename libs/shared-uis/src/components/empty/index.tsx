import React from "react";
import IconEmpty from "../icon/iconEmpty";

const Empty = ({ title = "List Empty" }: { title?: string }) => {
    return (
        <div className="w-full p-4 bg-white rounded-lg flex-col gap-2  h-full flex items-center justify-center">
            <IconEmpty size={72} />
            <p className="max-w-72 text-center text-sm">{title}</p>
        </div>
    );
};

export default Empty;
