import React from "react";
import Dialog from "@mui/material/Dialog";
import { MtUiButton } from "@/components/button";

type IProps = {
    handleClose: () => void;
    openDelete: boolean;
    handleDelete: () => void;
};
const ModalDelete = ({ handleClose, openDelete, handleDelete }: IProps) => {
    return (
        <Dialog
            open={openDelete}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className="min-w-[400px] p-4">
                <div className="pb-4">
                    Are you sure you want to delete this custom test?
                </div>
                <div className="w-full flex items-center gap-4 justify-center">
                    <MtUiButton block onClick={handleDelete}>
                        Ok
                    </MtUiButton>
                    <MtUiButton type="primary" block onClick={handleClose}>
                        Cancel
                    </MtUiButton>
                </div>
            </div>
        </Dialog>
    );
};

export default React.memo(ModalDelete);
