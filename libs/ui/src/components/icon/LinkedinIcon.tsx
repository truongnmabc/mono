const LinkedinIcon = ({ color = "#212121", colorApp = "#fff", width = 24, height = 24 }) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2793_1295)">
                <path
                    d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37259 5.37258 0 12 0C18.6274 0 24 5.37259 24 12Z"
                    fill={color}
                />
                <g clipPath="url(#clip1_2793_1295)">
                    <path
                        d="M7.02234 5.71094C6.05992 5.71094 5.43066 6.34291 5.43066 7.17356C5.43066 7.98586 6.04117 8.63586 6.98541 8.63586H7.00368C7.98493 8.63586 8.5956 7.98586 8.5956 7.17356C8.57725 6.34291 7.98493 5.71094 7.02234 5.71094Z"
                        fill={colorApp}
                    />
                    <path d="M5.59668 9.79102H8.41026V18.2558H5.59668V9.79102Z" fill={colorApp} />
                    <path
                        d="M15.317 9.59375C13.7992 9.59375 12.7814 11.02 12.7814 11.02V9.79242H9.96777V18.2572H12.7813V13.5301C12.7813 13.2771 12.7996 13.0244 12.874 12.8434C13.0774 12.3381 13.5402 11.8146 14.3175 11.8146C15.3356 11.8146 15.7428 12.5909 15.7428 13.7288V18.2572H18.5561V13.4036C18.5561 10.8036 17.168 9.59375 15.317 9.59375Z"
                        fill={colorApp}
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_2793_1295">
                    <rect width="24" height="24" fill={color} />
                </clipPath>
                <clipPath id="clip1_2793_1295">
                    <rect width="14" height="14" fill={color} transform="translate(5 5)" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default LinkedinIcon;
