export const CheckedIcon = ({ color = "#00c17c" }: { color?: string }) => {
    return (
        <svg
            width="15"
            height="12"
            viewBox="0 0 15 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.05078 5.92857L5.6067 9.48449C5.80926 9.68705 6.14027 9.67835 6.3319 9.46542L13.0508 2"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
};

export const LockIcon = () => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 11 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.25 5.32812H8.625V4.07812C8.625 2.35312 7.225 0.953125 5.5 0.953125C3.775 0.953125 2.375 2.35312 2.375 4.07812V5.32812H1.75C1.0625 5.32812 0.5 5.89062 0.5 6.57812V12.8281C0.5 13.5156 1.0625 14.0781 1.75 14.0781H9.25C9.9375 14.0781 10.5 13.5156 10.5 12.8281V6.57812C10.5 5.89062 9.9375 5.32812 9.25 5.32812ZM5.5 10.9531C4.8125 10.9531 4.25 10.3906 4.25 9.70312C4.25 9.01562 4.8125 8.45312 5.5 8.45312C6.1875 8.45312 6.75 9.01562 6.75 9.70312C6.75 10.3906 6.1875 10.9531 5.5 10.9531ZM3.625 4.07812V5.32812H7.375V4.07812C7.375 3.04063 6.5375 2.20312 5.5 2.20312C4.4625 2.20312 3.625 3.04063 3.625 4.07812Z"
                fill="#AEAEC0"
            />
        </svg>
    );
};

export const HalfCircleRight = () => {
    return (
        <div className=" absolute  top-[30px] w-9 h-[84px] -right-9">
            <svg width="40" height="84" viewBox="0 0 38 74" fill="none">
                <path
                    d="M0.220703 73C20.103 73 36.2207 56.8823 36.2207 37C36.2207 17.1177 20.103 1 0.220703 1"
                    stroke="#E3A651"
                    strokeDasharray="6 6"
                />
            </svg>
        </div>
    );
};

export const HalfCircleLeft = () => {
    return (
        <div className="  absolute top-[30px] w-9 h-[84px] -left-9">
            <svg
                width="40"
                height="84"
                viewBox="0 0 38 74"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M37 73C17.1177 73 1 56.8823 1 37C1 17.1177 17.1177 1 37 1"
                    stroke="#E3A651"
                    strokeDasharray="6 6"
                />
            </svg>
        </div>
    );
};
