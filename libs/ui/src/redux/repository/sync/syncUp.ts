import { createAsyncThunk } from "@reduxjs/toolkit";

export const syncUp = createAsyncThunk("syncUp", async ({}) => {
    console.log("up");
});
