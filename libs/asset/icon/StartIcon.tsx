import React from "react";

const StarIcon = ({ color = "#FFD43A", width = 25, height = 24 }) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="icon/toggle/star_24px">
                <path
                    id="icon/toggle/star_24px_2"
                    d="M12.5 17.5196L16.65 20.0296C17.41 20.4896 18.34 19.8096 18.14 18.9496L17.04 14.2296L20.71 11.0496C21.38 10.4696 21.02 9.36959 20.14 9.29959L15.31 8.88959L13.42 4.42959C13.08 3.61959 11.92 3.61959 11.58 4.42959L9.69001 8.87959L4.86001 9.28959C3.98001 9.35959 3.62001 10.4596 4.29001 11.0396L7.96001 14.2196L6.86001 18.9396C6.66001 19.7996 7.59001 20.4796 8.35001 20.0196L12.5 17.5196Z"
                    fill={color}
                />
            </g>
        </svg>
    );
};

export default StarIcon;
