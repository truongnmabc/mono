import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRounded from "@mui/icons-material/RadioButtonCheckedRounded";
import React from "react";
const _sx = { width: "20px", height: "20px" };

/**
 * GetIconPrefix
 *
 * This component renders different icons based on the user's actions and the review status.
 * It's primarily used in tests to indicate correct/incorrect answers, selected/unselected choices,
 * and allows answer selection in final tests.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {"miss" | "pass" | "other"} [props.statusChoice] - The status of the choice:
 * - `"miss"`: Incorrect answer
 * - `"pass"`: Correct answer
 * - `"other"`: Default (not answered)
 *
 * @param {boolean} [props.isActions=false] - Indicates if the user can perform actions (e.g., select an answer).
 * In final tests, this allows the user to select or change their answer.
 *
 * @param {boolean} [props.isSelect=false] - Indicates if the current choice is selected by the user.
 *
 * @param {boolean} [props.isReview=false] - Indicates if the review mode is active.
 * In review mode, the component shows feedback on whether the user's choice is correct.
 *
 * @param {boolean} [props.answerCorrect=false] - Indicates if the selected choice is correct.
 *
 * @returns {JSX.Element} - An icon representing the status of the user's choice:
 * - `RadioButtonCheckedRounded`: Selected option
 * - `RadioButtonUncheckedRoundedIcon`: Unselected option
 * - `CancelRoundedIcon`: Incorrect answer
 * - `CheckCircleRoundedIcon`: Correct answer
 */

const FN = ({
    statusChoice,
    isActions = false,
    isSelect,
    isReview,
    answerCorrect,
}: {
    isActions?: boolean;
    isSelect?: boolean;
    isReview?: boolean;
    answerCorrect?: boolean;
    statusChoice?: "miss" | "pass" | "other";
}) => {
    if (isActions) {
        if (isSelect) {
            return <RadioButtonCheckedRounded htmlColor="#AEAEB2" sx={_sx} />;
        } else {
            return (
                <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />
            );
        }
    }

    if (isReview) {
        if (isSelect && !answerCorrect) {
            return <CancelRoundedIcon htmlColor="#fb7072" sx={_sx} />; // chọn sai
        } else if (answerCorrect) {
            return <CheckCircleRoundedIcon htmlColor="#00c17c" sx={_sx} />; // chọn đúng hoặc đáp án đúng
        } else {
            return (
                // <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />
                <CancelRoundedIcon htmlColor="#fb7072" sx={_sx} /> // chọn sai
            );
        }
    }
    switch (statusChoice) {
        case "miss":
            return <CancelRoundedIcon htmlColor="#fb7072" sx={_sx} />; // chọn sai
        case "pass":
            return <CheckCircleRoundedIcon htmlColor="#00c17c" sx={_sx} />; // chọn đúng hoặc đáp án đúng
        default:
            return (
                <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />
            );
    }
};
const GetIconPrefix = React.memo(FN);
export default GetIconPrefix;
