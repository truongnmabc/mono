const FileIcon = ({ color = "gray", width = 26, height = 26 }) => {
    return (
        <svg
            focusable="false"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            data-testid="FeedIcon"
        >
            <path
                fill={color}
                d="M16 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8zM7 7h5v2H7zm10 10H7v-2h10zm0-4H7v-2h10zm-2-4V5l4 4z"
            ></path>
        </svg>
    );
};
export default FileIcon;
