import Link from "next/link";
import React from "react";

// Define the props type for LinkBlank
interface LinkBlankProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    href: string;
    children: React.ReactNode;
    classNames?: string;
}

// Use React.ForwardRefRenderFunction to properly type the forwarded ref
const LinkBlank: React.ForwardRefRenderFunction<
    HTMLAnchorElement,
    LinkBlankProps
> = ({ onClick, href, children, classNames }, ref) => {
    return (
        <Link passHref legacyBehavior href={href}>
            <a
                className={classNames}
                href={href}
                onClick={onClick}
                target="_blank"
                ref={ref}
                rel="noopener noreferrer"
            >
                {children}
            </a>
        </Link>
    );
};

// Use React.forwardRef to wrap the component
const ForwardedLinkBlank = React.forwardRef(LinkBlank);
export default ForwardedLinkBlank;
