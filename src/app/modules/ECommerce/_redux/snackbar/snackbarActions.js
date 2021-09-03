import { snackbarSlice } from "./snackbarSlice";
const { actions } = snackbarSlice;

export const setSnackbar = payload => dispatch => {
  console.log("snackbarAction", payload);
  const { status, message, show } = payload;
  dispatch(actions.setSnackbar({ status, message, show }));
};
