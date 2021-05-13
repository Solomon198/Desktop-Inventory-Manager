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
    // findUnitsForProduct
    // unitsForProductFetched: (state, action) => {
    //   const { totalCount, entities } = action.payload;
    //   state.listLoading = false;
    //   state.error = null;
    //   state.entities = entities;
    //   state.totalCount = totalCount;
    // },
    // findSalesForDebt
    // salesForDebtFetched: (state, action) => {
    //   const { totalCount, entities } = action.payload;
    //   state.listLoading = false;
    //   state.error = null;
    //   state.entities = entities;
    //   state.totalCount = totalCount;
    // },
    // createStock
    stockCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.sale);
    },
    // updateSale
    stockUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.sale._id) {
          return action.payload.sale;
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
