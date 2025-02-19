import React from "react";

const Blur = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="601"
      height="352"
      fill="none"
      viewBox="0 0 601 352"
    >
      <g clipPath="url(#clip0_1947_294)">
        <path fill="#fff" d="M0 0H601V352H0z"></path>
        <g opacity="0.6">
          <g filter="url(#filter0_f_1947_294)" opacity="0.3">
            <ellipse
              cx="154"
              cy="405.5"
              fill="#FBE83D"
              rx="154"
              ry="99.5"
            ></ellipse>
          </g>
          <g filter="url(#filter1_f_1947_294)" opacity="0.55">
            <ellipse
              cx="462.5"
              cy="350"
              fill="#7C6F5B"
              fillOpacity="0.54"
              rx="308.5"
              ry="224"
            ></ellipse>
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_1947_294"
          width="648"
          height="539"
          x="-170"
          y="136"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            result="effect1_foregroundBlur_1947_294"
            stdDeviation="85"
          ></feGaussianBlur>
        </filter>
        <filter
          id="filter1_f_1947_294"
          width="981"
          height="812"
          x="-28"
          y="-56"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            result="effect1_foregroundBlur_1947_294"
            stdDeviation="91"
          ></feGaussianBlur>
        </filter>
        <clipPath id="clip0_1947_294">
          <path fill="#fff" d="M0 0H601V352H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};
export default Blur;
