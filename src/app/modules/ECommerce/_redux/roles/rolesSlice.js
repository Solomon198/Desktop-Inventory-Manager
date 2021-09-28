import { createSlice } from "@reduxjs/toolkit";

const initialRolesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  roleForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState: initialRolesState,
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
    // getRoleById
    roleFetched: (state, action) => {
      state.actionsLoading = false;
      state.roleForEdit = action.payload.roleForEdit;
      state.error = null;
    },
    // findRoles
    rolesFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createRole
    roleCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload.role);
    },
    // updateRole
    roleUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity._id === action.payload.role._id) {
          return action.payload.role;
        }
        return entity;
      });
    },
    // deleteRole
    roleDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => el._id !== action.payload._id
      );
    },
    // deleteRoles
    rolesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el._id)
      );
    },
    // rolesUpdateState
    rolesStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map(entity => {
        if (ids.findIndex(id => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    }
  }
});
