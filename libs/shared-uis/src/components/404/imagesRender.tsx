"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import React from "react";

type ISize = {
  width: number;
  height: number;
};

const ImagesRender = ({
  name,
  size,
  mobileSize,
}: {
  name: string;
  size: ISize;
  mobileSize: ISize;
}) => {
  const isMobile = useIsMobile();
  const mobileFolder = isMobile ? "/mobile" : "";
  return (
    <Image
      className={name}
      src={"/images/404" + mobileFolder + "/" + name + ".png"}
      alt={name}
      height={isMobile ? size.height : mobileSize.height}
      width={isMobile ? size.width : mobileSize.width}
    />
  );
};

export default ImagesRender;
