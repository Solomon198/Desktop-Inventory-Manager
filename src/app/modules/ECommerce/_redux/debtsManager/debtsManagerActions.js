import * as requestFromServer from './debtsManagerCrud';
import { debtsManagerSlice, callTypes } from './debtsManagerSlice';
import Queries from '../../../../../dist/realm/queries/index';
const { actions } = debtsManagerSlice;
const DebtsManagerAPI = Queries.DebtsManagerAPI;

export const createCustomerTransaction = (customerTransaction) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return DebtsManagerAPI.createCustomerTransaction(customerTransaction)
    .then((customerTransaction) => {
      dispatch(actions.customerTransactionCreated({ customerTransaction }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchCustomerTransaction = (id) => (dispatch) => {
  console.log('TransactionAction', id);
  if (!id) {
    return dispatch(
      actions.customerTransactionFetched({ debtForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return DebtsManagerAPI.getCustomerTransaction(id)
    .then((customerTransaction) => {
      dispatch(
        actions.customerTransactionFetched({ debtForEdit: customerTransaction })
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateCustomerTransaction = (transactionToUpdate) => (
  dispatch
) => {
  console.log('ActionTransactionToUpdate', transactionToUpdate);
  dispatch(actions.startCall({ callType: callTypes.action }));
  return DebtsManagerAPI.updateCustomerTransaction(transactionToUpdate)
    .then((customerTransaction) => {
      console.log('ActionPayload', customerTransaction);
      dispatch(actions.customerTransactionUpdated({ customerTransaction }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
