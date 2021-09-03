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

// export const fetchSales = (queryParams) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.list }));

//   let { pageNumber, pageSize, filter } = queryParams;
//   let { firstName, type } = filter;
//   let customerType = typeof type === 'undefined' ? '' : type.toString();

//   return DebtsManagerAPI.getSales(pageNumber, pageSize, firstName, customerType)
//     .then((sales) => {
//       let { totalCount, entities } = sales;
//       dispatch(actions.salesFetched({ totalCount, entities }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

// export const fetchSalesHistoryForCustomer = (queryParams) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.list }));

//   let { pageNumber, pageSize, customerId } = queryParams;
//   // let { firstName, type } = filter;
//   // let customerType = typeof type === 'undefined' ? '' : type.toString();

//   return DebtsManagerAPI.getCustomerSalesHistory(pageNumber, pageSize, customerId)
//     .then((sales) => {
//       let { totalCount, entities } = sales;
//       dispatch(actions.salesHistoryForCustomer({ totalCount, entities }));
//     })
//     .catch((error) => {
//       console.log('ActionError', error);
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

// export const fetchSalesForDebt = (queryParams) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.list }));

//   let { pageNumber, pageSize, filter } = queryParams;
//   let { firstName, type } = filter;
//   let customerType = typeof type === 'undefined' ? '' : type.toString();

//   return DebtsManagerAPI.getSalesForDebt(pageNumber, pageSize, firstName, customerType)
//     .then((sales) => {
//       let { totalCount, entities } = sales;
//       dispatch(actions.salesForDebtFetched({ totalCount, entities }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

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
