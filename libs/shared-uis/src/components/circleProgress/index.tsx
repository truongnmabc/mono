import ctx from "@/utils/mergeClass";

type IProps = {
    percentage: number;
    color: string;
    bgColor: string;
    textAttributes?: React.SVGTextElementAttributes<SVGTextElement>;
    textClassName?: string;
    textStyles?: React.CSSProperties;
    circleAttributes?: React.SVGAttributes<SVGCircleElement>;
    circleClassName?: string;
    circleStyles?: React.CSSProperties;
    strokeWidth: number;
    size: number;
    customText?: React.ReactNode;
    showText?: boolean;
    wrapperClassName?: string;
    halfCircle?: boolean;
};

const CircleProgress = (props: IProps) => {
    const {
        customText,
        color,
        strokeWidth,
        percentage,
        size,
        bgColor,
        showText = true,
        halfCircle = false,
        ...res
    } = props;

    const pct = cleanPercentage(percentage);

    return (
        <div
            className={ctx("relative z-0 w-fit h-fit ", props.wrapperClassName)}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <g
                    transform={`rotate(${halfCircle ? -180 : -90} ${size / 2} ${
                        size / 2
                    })`}
                >
                    <Circle
                        {...res}
                        color={bgColor}
                        percentage={100}
                        size={size}
                        strokeWidth={strokeWidth}
                        halfCircle={halfCircle}
                    />
                    <Circle
                        {...res}
                        percentage={halfCircle ? pct : pct}
                        size={size}
                        color={color}
                        strokeWidth={strokeWidth}
                        halfCircle={halfCircle}
                    />
                </g>
                {showText && !customText && <Text percentage={pct} {...res} />}
            </svg>
            {customText}
        </div>
    );
};

const Circle = ({
    color,
    percentage,
    circleAttributes,
    strokeWidth,
    size,
    circleClassName,
    circleStyles,
    halfCircle = false,
}: {
    color: string;
    percentage: number;
    circleAttributes?: React.SVGAttributes<SVGCircleElement>;
    circleClassName?: string;
    circleStyles?: React.CSSProperties;
    strokeWidth: number;
    size: number;
    halfCircle?: boolean;
}) => {
    const r = size / 2 - strokeWidth;
    const circ = 2 * Math.PI * r;
    const halfCirc = circ / 2;

    const strokePct =
        ((100 - percentage) *
            (halfCircle && percentage !== 0 ? halfCirc : circ)) /
        100;

    return (
        <circle
            r={r}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            stroke={strokePct !== circ ? color : ""}
            strokeWidth={strokeWidth}
            strokeDasharray={halfCircle ? `${halfCirc} ${circ}` : circ}
            strokeDashoffset={percentage ? strokePct : 0}
            strokeLinecap="round"
            className={circleClassName}
            style={circleStyles}
            {...circleAttributes}
        ></circle>
    );
};

export default CircleProgress;

const Text = ({
    percentage,
    textAttributes,
    textClassName,
    textStyles,
}: {
    percentage: number;
    textClassName?: string;
    textStyles?: React.CSSProperties;
    textAttributes?: React.SVGTextElementAttributes<SVGTextElement>;
}) => {
    return (
        <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize={"1.5em"}
            className={textClassName}
            style={{
                ...textStyles,
                fill: "textColor",
            }}
            {...textAttributes}
        >
            {percentage.toFixed(0)}%
        </text>
    );
};

const cleanPercentage = (percentage: number) => {
    const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0;
    const isTooHigh = percentage > 100;
    return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};
