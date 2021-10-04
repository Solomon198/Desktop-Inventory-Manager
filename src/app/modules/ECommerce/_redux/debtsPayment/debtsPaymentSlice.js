import { createSlice } from '@reduxjs/toolkit';

const initialDebtsPaymentState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  debtPaymentForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const debtsPaymentSlice = createSlice({
  name: 'debtsPayment',
  initialState: initialDebtsPaymentState,
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
    // getDebtPaymentById
    debtPaymentFetched: (state, action) => {
      state.actionsLoading = false;
      state.debtPaymentForEdit = action.payload.debtPaymentForEdit;
      state.error = null;
    },
    // getCustomerDebtsPaymentById
    customerDebtsPaymentFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // findDebtsPayment
    debtsPaymentFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createDebtPayment
    debtPaymentCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.debtPayment);
    },
    // updateDebtPayment
    debtPaymentUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.debtPayment._id) {
          return action.payload.debtPayment;
        }
        return entity;
      });
    },
    // deleteDebtPayment
    debtPaymentDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload._id
      );
    },
    // deleteDebtsPayment
    debtsPaymentDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el._id)
      );
    },
  },
});
