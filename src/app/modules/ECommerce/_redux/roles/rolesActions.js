import * as requestFromServer from './rolesCrud';
import { rolesSlice, callTypes } from './rolesSlice';
import { setSnackbar } from '../snackbar/snackbarActions';
import Queries from '../../../../../dist/realm/queries/index';
const { actions } = rolesSlice;
const RoleAPI = Queries.RoleAPI;

export const fetchRoles = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { role_name } = filter;

  return RoleAPI.getRoles(pageNumber, pageSize, role_name)
    .then((roles) => {
      let { totalCount, entities } = roles;
      dispatch(actions.rolesFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRole = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.roleFetched({ roleForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return RoleAPI.getRole(id)
    .then((role) => {
      dispatch(actions.roleFetched({ roleForEdit: role }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createRole = (roleForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return RoleAPI.createRole(roleForCreation)
    .then((role) => {
      dispatch(actions.roleCreated({ role }));
      // dispatch(
      //   setSnackbar({
      //     status: 'success',
      //     message: 'Customer added successfully!',
      //     show: true,
      //   })
      // );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      dispatch(
        setSnackbar({
          status: 'error',
          messager: error,
          show: true,
        })
      );
    });
};

export const updateRole = (roleUpdates) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return RoleAPI.updateRole(roleUpdates)
    .then((role) => {
      dispatch(actions.roleUpdated({ role }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteRole = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return RoleAPI.removeRole(id)
    .then((result) => {
      dispatch(actions.roleDeleted({ id }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteRoles = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return RoleAPI.removeRoles(ids)
    .then(() => {
      dispatch(actions.rolesDeleted({ ids }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
