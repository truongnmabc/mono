import React from "react";

const DropDown = ({ isRotated = false }) => {
    return (
        <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                transform: isRotated ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
            }}
        >
            <path
                d="M12.6663 5.83333L7.99967 10.5L3.33301 5.83333"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default DropDown;
