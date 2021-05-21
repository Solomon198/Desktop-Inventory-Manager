import { createSlice } from '@reduxjs/toolkit';

const initialExpensesItemState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  expenseItemForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const expensesItemSlice = createSlice({
  name: 'expensesItem',
  initialState: initialExpensesItemState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // getExpensesItemById
    expenseItemFetched: (state, action) => {
      state.actionsLoading = false;
      state.expenseItemForEdit = action.payload.expenseItemForEdit;
      state.error = null;
    },
    // findExpensesItem
    expensesItemFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createExpenseItem
    expenseItemCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.expenseItem);
    },
    // updateExpenseItem
    expenseItemUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.expenseItem._id) {
          return action.payload.expenseItem;
        }
        return entity;
      });
    },
    // deleteExpenseItem
    expenseItemDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload._id
      );
    },
    // deleteExpensesItem
    expensesItemDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el._id)
      );
    },
    // salesUpdateState
    //     salesStatusUpdated: (state, action) => {
    //       state.actionsLoading = false;
    //       state.error = null;
    //       const { ids, status } = action.payload;
    //       state.entities = state.entities.map(entity => {
    //         if (ids.findIndex(id => id === entity._id) > -1) {
    //           entity.status = status;
    //         }
    //         return entity;
    //       });
    //     }
  },
});
