const XIcon = ({ color = "#212121", width = 24, height = 24 }) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23.5 12C23.5 18.3513 18.3513 23.5 12 23.5C5.64873 23.5 0.5 18.3513 0.5 12C0.5 5.64872 5.64873 0.5 12 0.5C18.3513 0.5 23.5 5.64872 23.5 12Z"
                stroke={color}
            />
            <path
                d="M16.1627 5.5H18.368L13.55 11.0067L19.218 18.5H14.78L11.304 13.9553L7.32666 18.5H5.12L10.2733 12.61L4.836 5.5H9.38666L12.5287 9.654L16.1627 5.5ZM15.3887 17.18H16.6107L8.72266 6.75067H7.41133L15.3887 17.18Z"
                fill={color}
            />
        </svg>
    );
};

export default XIcon;
