import * as requestFromServer from "./expensesCrud";
import { expensesSlice, callTypes } from "./expensesSlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = expensesSlice;
const ExpenseAPI = Queries.ExpenseAPI;

// export const fetchExpenses = (queryParams) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.list }));

//   let { pageNumber, pageSize, filter } = queryParams;
//   let { firstName, type } = filter;
//   let customerType = typeof type === 'undefined' ? '' : type.toString();

//   return ExpenseAPI.getCustomers(pageNumber, pageSize, firstName, customerType)
//     .then((expenses) => {
//       let { totalCount, entities } = expenses;
//       dispatch(actions.expensesFetched({ totalCount, entities }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

// export const fetchExpense = (id) => (dispatch) => {
//   if (!id) {
//     return dispatch(actions.expenseFetched({ expenseForEdit: undefined }));
//   }

//   dispatch(actions.startCall({ callType: callTypes.action }));

//   return ExpenseAPI.getProduct(id)
//     .then((expense) => {
//       dispatch(actions.expenseFetched({ expenseForEdit: expense }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const createExpense = (expenseForCreation) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ExpenseAPI.createExpense(expenseForCreation)
//     .then((expense) => {
//       dispatch(actions.expenseCreated({ expense }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const updateExpense = (productUpdates) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ExpenseAPI.updateExpense(productUpdates)
//     .then((expense) => {
//       dispatch(actions.expenseUpdated({ expense }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const deleteExpense = (id) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ExpenseAPI.removeExpense(id)
//     .then((result) => {
//       dispatch(actions.expenseDeleted({ id }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

export const fetchExpenses = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return ExpenseAPI.getExpenses(pageNumber, pageSize, firstName, customerType)
    .then(expenses => {
      let { totalCount, entities } = expenses;
      dispatch(actions.expensesFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchExpense = id => dispatch => {
  if (!id) {
    return dispatch(actions.expenseFetched({ expenseForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return ExpenseAPI.getExpense(id)
    .then(expense => {
      dispatch(actions.expenseFetched({ expenseForEdit: expense }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteExpense = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseAPI.removeExpense(id)
    .then(result => {
      dispatch(actions.expenseDeleted({ id }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createExpense = expenseForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseAPI.createExpense(expenseForCreation)
    .then(expense => {
      dispatch(actions.expenseCreated({ expense }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateExpense = expense => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseAPI.updateExpense(expense)
    .then(expense => {
      console.log(expense);
      dispatch(actions.expenseUpdated({ expense }));
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// export const updateProductsStatus = (ids, status) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .updateStatusForProducts(ids, status)
//     .then(() => {
//       dispatch(actions.productsStatusUpdated({ ids, status }));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't update expenses status";
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

export const deleteExpenses = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseAPI.removeExpenses(ids)
    .then(() => {
      dispatch(actions.expensesDeleted({ ids }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
