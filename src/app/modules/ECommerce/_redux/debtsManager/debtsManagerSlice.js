import { createSlice } from '@reduxjs/toolkit';

const initialDebtsManagerState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  debtForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const debtsManagerSlice = createSlice({
  name: 'debtsManager',
  initialState: initialDebtsManagerState,
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
    // getCustomerTransactionById
    customerTransactionFetched: (state, action) => {
      state.actionsLoading = false;
      state.debtForEdit = action.payload.debtForEdit;
      state.error = null;
    },
    // createCustomerTransaction
    customerTransactionCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.customerTransaction);
    },
    // updateCustomerTransaction
    customerTransactionUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;

      state.debtForEdit = [action.payload.customerTransaction];
    },
  },
});
