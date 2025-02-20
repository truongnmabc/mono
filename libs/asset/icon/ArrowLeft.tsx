import React from "react";

const ArrowLeft = ({ color = "#262626", width = 16, height = 16 }) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.9048 13.0286L5.76511 8.8889C5.27622 8.40001 5.27622 7.60001 5.76511 7.11112L9.9048 2.97144"
                stroke={color}
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ArrowLeft;
