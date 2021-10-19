import React, { Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { setSnackbar } from "./modules/ECommerce/_redux/snackbar/snackbarActions";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);
const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function BasePage() {
  const { snackbarStatus, snackbarMessage, snackbarShow } = useSelector(
    state => ({
      snackbarStatus: state.snackbar.snackbarStatus,
      snackbarMessage: state.snackbar.snackbarMessage,
      snackbarShow: state.snackbar.snackbarShow
    })
  );
  const dispatch = useDispatch();
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <>
      <Snackbar
        open={snackbarShow}
        autoHideDuration={6000}
        onClose={() => dispatch(setSnackbar({ show: false, message: "" }))}
      >
        <Alert
          onClose={() => dispatch(setSnackbar({ show: true, message: "" }))}
          severity={snackbarStatus || "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Suspense fallback={<LayoutSplashScreen />}>
        <Switch>
          {
            /* Redirect from root URL to /dashboard. */
            <Redirect exact from="/" to="/dashboard" />
          }
          <ContentRoute path="/dashboard" component={DashboardPage} />
          <ContentRoute path="/builder" component={BuilderPage} />
          <ContentRoute path="/my-page" component={MyPage} />
          <Route path="/google-material" component={GoogleMaterialPage} />
          <Route path="/react-bootstrap" component={ReactBootstrapPage} />
          <Route path="/e-commerce" component={ECommercePage} />
          <Route path="/user-profile" component={UserProfilepage} />
          <Redirect to="error/error-v1" />
        </Switch>
      </Suspense>
    </>
  );
}
