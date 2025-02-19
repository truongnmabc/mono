"use client";
import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import getListActionThunk from "@/redux/repository/user/getActions";
import { useEffect } from "react";

const UserActionListen = () => {
    const idTopic = useAppSelector(selectCurrentTopicId);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (idTopic) {
            dispatch(
                getListActionThunk({
                    partId: idTopic,
                })
            );
        }
    }, [idTopic, dispatch]);

    return null;
};

export default UserActionListen;
