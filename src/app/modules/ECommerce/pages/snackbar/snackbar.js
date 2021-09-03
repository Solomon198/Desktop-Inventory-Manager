import React from "react";
// import {useSelector, useDispatch} from 'react-redux'
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Snackbars({
  open,
  duration,
  handleClose,
  severity,
  message
}) {
  // const { snackbarStatus, snackbarMessage, snackbarShow } = useSelector(
  //     (state) => ({
  //       snackbarStatus: state.snackbar.snackbarStatus,
  //       snackbarMessage: state.snackbar.snackbarMessage,
  //       snackbarShow: state.snackbar.snackbarShow,
  //     })
  //   );
  //   const dispatch = useDispatch();
  //   console.log(snackbarStatus, snackbarMessage, snackbarShow);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity || "success"}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
