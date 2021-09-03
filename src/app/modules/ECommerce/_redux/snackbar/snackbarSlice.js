import { createSlice } from "@reduxjs/toolkit";

const initialSnackbarState = {
  snackbarStatus: "success",
  snackbarMessage: "",
  snackbarShow: false
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: initialSnackbarState,
  reducers: {
    setSnackbar: (state, action) => {
      const { status, message, show } = action.payload;
      state.snackbarStatus = status;
      state.snackbarMessage = message;
      state.snackbarShow = show;
    }
  }
});
