// "use client";
// import { selectAppInfo } from "@/redux/features/appInfo.reselect";
// import { useAppSelector } from "@/redux/hooks";
// import ctx from "@/utils/mergeClass";
// import { Dialog } from "@mui/material";
// import React, { CSSProperties, useCallback, useState } from "react";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";

// export interface ILazyLoadImages {
//     src: string;
//     alt?: string;
//     classNames?: string;
//     styles?: CSSProperties;
//     imgStyles?: CSSProperties;
//     imgClassNames?: string;
//     onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
//     priority?: boolean;
//     draggable?: boolean;
//     isPreview?: boolean;
// }

// const fallbackImage = `/images/logo/logo60.png`;

// const LazyLoadImage: React.FC<ILazyLoadImages> = ({
//     src,
//     alt,
//     imgClassNames,
//     imgStyles,
//     classNames,
//     styles,
//     onClick,
//     priority = true,
//     isPreview = false,
//     ...rest
// }) => {
//     const appInfo = useAppSelector(selectAppInfo);
//     const imgAlt = alt || appInfo?.appShortName;
//     const [currentSrc, setCurrentSrc] = useState(src);
//     const [open, setOpen] = useState(false);

//     const handleOpen = useCallback(() => {
//         if (isPreview) setOpen(true);
//     }, [isPreview]);

//     const handleError = useCallback(() => {
//         setCurrentSrc(fallbackImage);
//     }, []);

//     const handleClose = useCallback(() => {
//         setOpen(false);
//     }, []);

//     return (
//         <div
//             style={styles}
//             className={ctx("relative w-full h-full", classNames)}
//             onClick={onClick}
//         >
//             {/* Image Container */}
//             <div className="relative w-full h-full">
//                 <img
//                     src={currentSrc}
//                     alt={imgAlt}
//                     onError={handleError}
//                     className={ctx(
//                         "object-contain w-full h-full transition-all",
//                         imgClassNames
//                     )}
//                     draggable={false}
//                     loading={priority ? "eager" : "lazy"}
//                     style={imgStyles}
//                     {...rest}
//                 />

//                 {/* Zoom Icon - Gắn trực tiếp vào ảnh */}
//                 {isPreview && (
//                     <div
//                         onClick={handleOpen}
//                         className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-md"
//                     >
//                         <ZoomInIcon className="text-white text-4xl" />
//                     </div>
//                 )}
//             </div>

//             {/* Image Preview Dialog */}
//             <Dialog open={open} onClose={handleClose}>
//                 <img
//                     src={currentSrc}
//                     alt={imgAlt}
//                     onError={() => setCurrentSrc(fallbackImage)}
//                     className={ctx(
//                         "object-contain w-full h-full transition-all",
//                         imgClassNames
//                     )}
//                     loading={priority ? "eager" : "lazy"}
//                     style={imgStyles}
//                     {...rest}
//                 />
//             </Dialog>
//         </div>
//     );
// };

// export default LazyLoadImage;

"use client";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { Dialog } from "@mui/material";
import React, { CSSProperties, useCallback, useState } from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";
import clsx from "clsx";

export interface ILazyLoadImages {
    src: string;
    alt?: string;
    classNames?: string;
    styles?: CSSProperties;
    imgStyles?: CSSProperties;
    imgClassNames?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    priority?: boolean;
    draggable?: boolean;
    isPreview?: boolean;
    width?: number;
    height?: number;
}

const FALLBACK_IMAGE = "/images/logo/logo60.png";

const LazyLoadImage: React.FC<ILazyLoadImages> = ({
    src,
    alt,
    imgClassNames,
    imgStyles,
    classNames,
    styles,
    onClick,
    priority = true,
    isPreview = false,
    width = 500,
    height = 300,
    ...rest
}) => {
    const appInfo = useAppSelector(selectAppInfo);
    const imgAlt = alt || appInfo?.appShortName || "Image";
    const isMobile = useIsMobile();
    const [imageSrc, setImageSrc] = useState(src);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = useCallback(() => {
        if (isPreview) setIsDialogOpen(true);
    }, [isPreview]);

    const handleImageError = useCallback(() => {
        setImageSrc(FALLBACK_IMAGE);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setIsDialogOpen(false);
    }, []);

    return (
        <div
            style={styles}
            className={ctx("relative w-full h-full", classNames)}
            onClick={onClick}
        >
            {/* Image Container */}
            <div className="relative w-full h-full">
                <Image
                    src={imageSrc}
                    alt={imgAlt}
                    width={width}
                    height={height}
                    onError={handleImageError}
                    className={ctx(
                        "object-contain w-full h-full transition-all",
                        imgClassNames
                    )}
                    draggable={false}
                    priority={priority}
                    style={imgStyles}
                    {...rest}
                />

                {/* Zoom Icon - Hiển thị khi hover */}
                {isPreview && (
                    <div
                        onClick={handleOpenDialog}
                        className={clsx(
                            "absolute  flex items-center justify-center   transition-opacity  rounded-md cursor-pointer",
                            {
                                "opacity-0 inset-0 bg-black/30  hover:opacity-100":
                                    !isMobile,
                                "bottom-0 right-0  ": isMobile,
                            }
                        )}
                    >
                        <ZoomInIcon
                            className={clsx({
                                "text-white": !isMobile,
                                "text-black/30": isMobile,
                            })}
                        />
                    </div>
                )}
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <Image
                    src={imageSrc}
                    alt={imgAlt}
                    width={width * 2}
                    height={height * 2}
                    onError={() => setImageSrc(FALLBACK_IMAGE)}
                    className={ctx(
                        "object-contain w-full h-full transition-all",
                        imgClassNames
                    )}
                    priority={priority}
                    style={imgStyles}
                    {...rest}
                />
            </Dialog>
        </div>
    );
};

export default LazyLoadImage;
