import * as requestFromServer from "./debtsPaymentCrud";
import { debtsPaymentSlice, callTypes } from "./debtsPaymentSlice";
import { setSnackbar } from "../snackbar/snackbarActions";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = debtsPaymentSlice;
const DebtPaymentAPI = Queries.DebtsPaymentAPI;

export const fetchDebtsPayment = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let debtPaymentType = typeof type === "undefined" ? "" : type.toString();

  return DebtPaymentAPI.getDebtPayments(
    pageNumber,
    pageSize,
    firstName,
    debtPaymentType
  )
    .then(debtsPayment => {
      let { totalCount, entities } = debtsPayment;
      dispatch(actions.debtsPaymentFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDebtPayment = id => dispatch => {
  if (!id) {
    return dispatch(
      actions.debtPaymentFetched({ debtPaymentForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return DebtPaymentAPI.getDebtPayment(id)
    .then(debtPayment => {
      dispatch(actions.debtPaymentFetched({ debtPaymentForEdit: debtPayment }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchCustomerDebtsPaymentHistory = (
  queryParams,
  customerId
) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize } = queryParams;
  // let { firstName, type } = filter;
  // let customerType = typeof type === 'undefined' ? '' : type.toString();

  return DebtPaymentAPI.getCustomerDebtPaymentsHistory(
    pageNumber,
    pageSize,
    customerId
  )
    .then(debtsPayment => {
      let { totalCount, entities } = debtsPayment;
      dispatch(actions.customerDebtsPaymentFetched({ totalCount, entities }));
    })
    .catch(error => {
      console.log("ActionError", error);
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createDebtPayment = debtPaymentForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return DebtPaymentAPI.createDebtPayment(debtPaymentForCreation)
    .then(debtPayment => {
      dispatch(actions.debtPaymentCreated({ debtPayment }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      dispatch(
        setSnackbar({
          status: "error",
          messager: error,
          show: true
        })
      );
    });
};

export const updateDebtPayment = debtPaymentUpdates => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return DebtPaymentAPI.updateDebtPayment(debtPaymentUpdates)
    .then(debtPayment => {
      dispatch(actions.debtPaymentUpdated({ debtPayment }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteDebtPayment = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return DebtPaymentAPI.removeDebtPayment(id)
    .then(result => {
      dispatch(actions.debtPaymentDeleted({ id }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteDebtsPayment = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return DebtPaymentAPI.removeDebtPayments(ids)
    .then(() => {
      dispatch(actions.debtsPaymentDeleted({ ids }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
