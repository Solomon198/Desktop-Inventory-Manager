import { createSlice } from '@reduxjs/toolkit';

const initialStocksState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  stockForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const stocksSlice = createSlice({
  name: 'stocks',
  initialState: initialStocksState,
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
    // getStockById
    stockFetched: (state, action) => {
      state.actionsLoading = false;
      state.stockForEdit = action.payload.stockForEdit;
      state.error = null;
    },
    // findStocks
    stocksFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createStock
    stockCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload.stock);
    },
    // updateSale
    stockUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.stock._id) {
          return action.payload.stock;
        }
        return entity;
      });
    },
    // deleteSale
    stockDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload._id
      );
    },
    // deleteSales
    salesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el._id)
      );
    },
  },
});
