import { createSlice } from '@reduxjs/toolkit';

const initialSuppliersState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  supplierForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: initialSuppliersState,
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
    // getSupplierById
    supplierFetched: (state, action) => {
      state.actionsLoading = false;
      state.supplierForEdit = action.payload.supplierForEdit;
      state.error = null;
    },
    // findSuppliers
    suppliersFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createSupplier
    supplierCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload.supplier);
    },
    // updateSupplier
    supplierUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity._id === action.payload.supplier._id) {
          return action.payload.supplier;
        }
        return entity;
      });
    },
    // deleteSupplier
    supplierDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el._id !== action.payload._id
      );
    },
    // deleteSuppliers
    suppliersDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el._id)
      );
    },
    // suppliersUpdateState
    suppliersStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map((entity) => {
        if (ids.findIndex((id) => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    },
  },
});
