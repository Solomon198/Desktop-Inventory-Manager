import { createSlice } from "@reduxjs/toolkit";

const initialStocksEntryState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  stockEntryQuantity: null,
  stockEntryForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const stocksEntrySlice = createSlice({
  name: "stocksEntry",
  initialState: initialStocksEntryState,
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
    // getStockEntryById
    stockEntryFetched: (state, action) => {
      state.actionsLoading = false;
      state.stockEntryForEdit = action.payload.stockEntryForEdit;
      state.error = null;
    },
    // findStocksEntry
    stocksEntryFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // getStockEntryQuantityByUnitId
    stockEntryQuantityFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.totalCount = totalCount;
      state.entities = entities;
    },
    //decrementProductUnitsByQuantity
    stockEntryUnitQuantityFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.forEach(obj => {
        if (obj.unit_id === action.payload.unit_id)
          return (obj.quantity -= action.payload.quantity);
      });
    },
    // createStockEntry
    stockEntryCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.stockEntry);
    },
    // updateStockEntry
    stockEntryUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity._id === action.payload.stockEntry._id) {
          return action.payload.stockEntry;
        }
        return entity;
      });
    },
    // decrementStockEntry
    // stockEntryDecremented: (state, action) => {
    //   state.error = null;
    //   state.actionsLoading = false;
    //   state.entities = state.entities.map((entity) => {
    //     if (entity.unit_id === action.payload.stocksEntry.unit_id) {
    //       entity.quantity -= action.payload.stocksEntry.quantity;
    //     }
    //     return entity;
    //   });
    // },
    // deleteStockEntry
    stockEntryDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => el._id !== action.payload._id
      );
    },
    // deleteStocksEntry
    stocksEntryDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el._id)
      );
    }
  }
});
