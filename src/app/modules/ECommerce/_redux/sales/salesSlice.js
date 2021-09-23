import { createSlice } from '@reduxjs/toolkit';

const initialSalesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  totalDebtCount: 0,
  entities: null,
  debtEntities: null,
  saleForEdit: undefined,
  lastSale: [],
  lastError: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState: initialSalesState,
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
    // getSaleById
    saleFetched: (state, action) => {
      state.actionsLoading = false;
      state.saleForEdit = action.payload.saleForEdit;
      state.error = null;
    },
    // findSales
    salesFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // findSalesHistoryForCustomer
    salesHistoryForCustomer: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // findDebtsHistoryForCustomer
    debtsHistoryForCustomer: (state, action) => {
      const { totalDebtCount, debtEntities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.debtEntities = debtEntities;
      state.totalDebtCount = totalDebtCount;
    },
    // findSalesForDebt
    salesForDebtFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createSale
    saleCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload.sale);
      state.lastSale.push(action.payload.sale);
    },
  },
});
