import * as requestFromServer from './expensesItemCrud';
import { expensesItemSlice, callTypes } from './expensesItemSlice';
import Queries from '../../../../../dist/realm/queries/index';
const { actions } = expensesItemSlice;
const ExpenseItemAPI = Queries.ExpenseItemAPI;

export const createExpenseItem = (expenseItemForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseItemAPI.createExpenseItem(expenseItemForCreation)
    .then((expenseItem) => {
      dispatch(actions.expenseItemCreated({ expenseItem }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchExpensesItem = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === 'undefined' ? '' : type.toString();

  return ExpenseItemAPI.getExpensesItem(
    pageNumber,
    pageSize,
    firstName,
    customerType
  )
    .then((expensesItem) => {
      let { totalCount, entities } = expensesItem;
      dispatch(actions.expensesItemFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchExpenseItem = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.expenseItemFetched({ expenseItemForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return ExpenseItemAPI.getExpenseItem(id)
    .then((expenseItem) => {
      dispatch(actions.expenseItemFetched({ expenseItemForEdit: expenseItem }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteExpenseItem = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseItemAPI.removeExpenseItem(id)
    .then((result) => {
      dispatch(actions.expenseItemDeleted({ id }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateExpenseItem = (expenseItem) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseItemAPI.updateExpenseItem(expenseItem)
    .then((expenseItem) => {
      dispatch(actions.expenseItemUpdated({ expenseItem }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteExpensesItem = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ExpenseItemAPI.removeExpensesItem(ids)
    .then(() => {
      dispatch(actions.expensesItemDeleted({ ids }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
