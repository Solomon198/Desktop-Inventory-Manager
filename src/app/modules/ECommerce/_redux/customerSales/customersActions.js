import * as requestFromServer from "./customersCrud";
import { customersSlice, callTypes } from "./customersSlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = customersSlice;
const CustomerAPI = Queries.CustomerAPI;

export const fetchCustomers = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return CustomerAPI.getCustomers(pageNumber, pageSize, firstName, customerType)
    .then(customers => {
      let { totalCount, entities } = customers;
      dispatch(actions.customersFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCustomer = id => dispatch => {
  if (!id) {
    return dispatch(actions.customerFetched({ customerForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return CustomerAPI.getCustomer(id)
    .then(customer => {
      dispatch(actions.customerFetched({ customerForEdit: customer }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createCustomer = customerForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return CustomerAPI.createCustomer(customerForCreation)
    .then(customer => {
      dispatch(actions.customerCreated({ customer }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateCustomer = customerUpdates => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return CustomerAPI.updateCustomer(customerUpdates)
    .then(customer => {
      dispatch(actions.customerUpdated({ customer }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCustomer = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return CustomerAPI.removeCustomer(id)
    .then(result => {
      dispatch(actions.customerDeleted({ id }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCustomers = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return CustomerAPI.removeCustomers(ids)
    .then(() => {
      dispatch(actions.customersDeleted({ ids }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
