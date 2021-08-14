import * as requestFromServer from './suppliersCrud';
import { suppliersSlice, callTypes } from './suppliersSlice';
import Queries from '../../../../../dist/realm/queries/index';
const { actions } = suppliersSlice;
const SupplierAPI = Queries.SupplierAPI;

export const fetchSuppliers = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let supplierType = typeof type === 'undefined' ? '' : type.toString();

  return SupplierAPI.getSuppliers(pageNumber, pageSize, firstName, supplierType)
    .then((suppliers) => {
      let { totalCount, entities } = suppliers;
      dispatch(actions.suppliersFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchSupplier = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.supplierFetched({ supplierForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return SupplierAPI.getSupplier(id)
    .then((supplier) => {
      dispatch(actions.supplierFetched({ supplierForEdit: supplier }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createSupplier = (supplierForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return SupplierAPI.createSupplier(supplierForCreation)
    .then((supplier) => {
      dispatch(actions.supplierCreated({ supplier }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateSupplier = (supplierUpdates) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return SupplierAPI.updateSupplier(supplierUpdates)
    .then((supplier) => {
      dispatch(actions.supplierUpdated({ supplier }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteSupplier = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return SupplierAPI.removeSupplier(id)
    .then((result) => {
      dispatch(actions.supplierDeleted({ id }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteSuppliers = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return SupplierAPI.removeSuppliers(ids)
    .then(() => {
      dispatch(actions.suppliersDeleted({ ids }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
