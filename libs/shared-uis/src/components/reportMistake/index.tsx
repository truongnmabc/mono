"use client";
import { MtUiButton } from "@/components/button";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { setShouldListenKeyboard } from "@/redux/features/game";
import {
    selectCurrentGame,
    selectCurrentTopicId,
} from "@/redux/features/game.reselect";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import userActionsThunk from "@/redux/repository/user/actions";
import reportMistakeApi from "@/services/report.service";
import {
    Box,
    Checkbox,
    FormControl,
    FormGroup,
    TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

const listReport = [
    { label: "Incorrect Answer", value: 0 },
    { label: "Wrong Explanation", value: 1 },
    { label: "Wrong Category", value: 2 },
    { label: "Grammatical Error", value: 3 },
    { label: "Missing Content", value: 4 },
    { label: "Type", value: 5 },
    { label: "Bad Image Quality", value: 6 },
];

const ReportMistake = ({ onClose }: { onClose: () => void }) => {
    const [selectedValues, setSelectedValues] = useState<number[]>([]);
    const [otherReason, setOtherReason] = useState<string>("");
    const dispatch = useAppDispatch();
    const currentGame = useAppSelector(selectCurrentGame);
    const idTopic = useAppSelector(selectCurrentTopicId);
    const appInfos = useAppSelector(selectAppInfo);
    const userInfos = useAppSelector(selectUserInfo);
    const [isLoading, setIsLoading] = useState(false);
    const handleCheckboxChange = useCallback((value: number) => {
        setSelectedValues((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    }, []);

    useEffect(() => {
        dispatch(setShouldListenKeyboard(false));
        return () => {
            dispatch(setShouldListenKeyboard(true));
        };
    }, [dispatch]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            try {
                setIsLoading(true);
                e.preventDefault();

                await reportMistakeApi({
                    appId: Number(appInfos.appId),
                    questionId: currentGame.id,
                    reasons: selectedValues,
                    otherReason: otherReason,
                    gameType: "allQuestions",
                    userId: Number(userInfos.id || -1),
                });
                dispatch(
                    userActionsThunk({
                        status: "dislike",
                        questionId: currentGame?.id,
                        partId: idTopic,
                    })
                );

                onClose();
            } catch (error) {
                console.log("🚀 ~ handleSubmit ~ error:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [
            dispatch,
            idTopic,
            currentGame?.id,
            onClose,
            otherReason,
            appInfos,
            selectedValues,
            userInfos,
        ]
    );

    return (
        <form
            className="h-full py-4 px-6 bg-theme-white sm:bg-white sm:w-[600px] rounded-md flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <h3 className="font-poppins text-2xl font-semibold text-center">
                Report a Mistake
            </h3>

            <FormControl component="fieldset" fullWidth>
                <FormGroup>
                    {listReport.map((item) => (
                        <Box
                            key={item.value}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <div className="text-lg font-poppins font-medium">
                                {item.label}
                            </div>
                            <Checkbox
                                sx={{
                                    color: "#7C6F5B",
                                }}
                                checked={selectedValues.includes(item.value)}
                                onChange={() =>
                                    handleCheckboxChange(item.value)
                                }
                            />
                        </Box>
                    ))}
                </FormGroup>
            </FormControl>

            <TextField
                placeholder="Other reasons"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                sx={{
                    "& .MuiInput-underline:before": {
                        borderBottomColor: "#21212185",
                        borderBottomWidth: "2px",
                    },
                    "& .MuiInput-underline:hover:before": {
                        borderBottomColor: "#7C6F5B",
                    },
                    "& .MuiInput-underline:after": {
                        borderBottomColor: "#7C6F5B",
                    },
                    "& input": {
                        color: "#7C6F5B",
                    },
                }}
                fullWidth
                variant="standard"
            />

            <MtUiButton
                block
                type="primary"
                size="large"
                htmlType="submit"
                disabled={selectedValues.length === 0 && !otherReason}
                loading={isLoading}
            >
                Report
            </MtUiButton>
        </form>
    );
};

export default ReportMistake;
