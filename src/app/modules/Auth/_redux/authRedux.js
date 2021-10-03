import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "./authCrud";
import { getBusinessNameByToken } from "./authCrud";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  Connect: "[Connect] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetUser: "[Set User] Action",
  BusinessNameRequested: "[Request BusinessName] Action",
  BusinessNameLoaded: "[Load BusinessName] Auth API",
  SetBusinessName: "[Set BusinessName] Action"
};

const initialAuthState = {
  user: undefined,
  businessName: undefined,
  authToken: undefined
};

export const reducer = persistReducer(
  {
    storage,
    key: "v713-demo1-auth",
    whitelist: ["user", "authToken", "businessName"]
  },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;

        return { authToken, user: undefined, businessName: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      case actionTypes.Connect: {
        const { authToken } = action.payload;

        return { authToken, user: undefined, businessName: undefined };
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        return { ...state, user };
      }

      case actionTypes.SetUser: {
        const { user } = action.payload;
        return { ...state, user };
      }

      case actionTypes.BusinessNameLoaded: {
        const { businessName } = action.payload;
        return { ...state, businessName };
      }

      case actionTypes.SetBusinessName: {
        const { businessName } = action.payload;
        return { ...state, businessName };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
  connect: authToken => ({
    type: actionTypes.Connect,
    payload: { authToken }
  }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({
    type: actionTypes.UserRequested,
    payload: { user }
  }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: user => ({ type: actionTypes.SetUser, payload: { user } }),
  requestBusinessName: businessName => ({
    type: actionTypes.BusinessNameRequested,
    payload: { businessName }
  }),
  fulfillBusinessName: businessName => ({
    type: actionTypes.BusinessNameLoaded,
    payload: { businessName }
  }),
  SetBusinessName: businessName => ({
    type: actionTypes.SetBusinessName,
    payload: { businessName }
  })
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Connect, function* connectSaga() {
    yield put(actions.requestBusinessName());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data: user } = yield getUserByToken();
    console.log("RequestedUser", user);

    yield put(actions.fulfillUser(user));
  });

  yield takeLatest(
    actionTypes.BusinessNameRequested,
    function* businessNameRequested() {
      const { data: businessName } = yield getBusinessNameByToken();
      console.log("RequestedBusinessName_", businessName);

      yield put(actions.fulfillBusinessName(businessName));
    }
  );
}
