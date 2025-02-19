import { CSSProperties } from "react";
import ctx from "@/utils/mergeClass";
const MyContainer = ({
    children,
    className,
    style,
}: {
    children?: React.ReactNode;
    className?: string;
    style?: CSSProperties;
}) => {
    return (
        <div
            className={ctx(
                "w-full block box-border mx-auto  max-w-page ",
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
};

export default MyContainer;
