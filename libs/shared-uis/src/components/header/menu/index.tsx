import { Grid2 } from "@mui/material";
import React from "react";
import IconMenuHeader from "./icon/iconMenuHeader";

import MenuHeaderDesktop from "./menuHeader";

const FN = () => {
    return (
        <Grid2 className=" h-full " container id="menu_header">
            <Grid2
                size={{
                    xs: 12,
                    sm: 0,
                }}
            >
                <IconMenuHeader />
            </Grid2>
            <Grid2
                size={{
                    xs: 0,
                    sm: 12,
                }}
            >
                <MenuHeaderDesktop />
            </Grid2>
        </Grid2>
    );
};
const MenuHeader = React.memo(FN);
export default MenuHeader;
