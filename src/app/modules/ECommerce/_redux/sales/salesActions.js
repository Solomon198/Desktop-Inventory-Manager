import * as requestFromServer from "./salesCrud";
import { salesSlice, callTypes } from "./salesSlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = salesSlice;
const SaleAPI = Queries.SaleAPI;

export const createSale = saleForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return SaleAPI.createSale(saleForCreation)
    .then(sale => {
      dispatch(actions.saleCreated({ sale }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchSales = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return SaleAPI.getSales(pageNumber, pageSize, firstName, customerType)
    .then(sales => {
      let { totalCount, entities } = sales;
      dispatch(actions.salesFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchSalesHistoryForCustomer = (
  queryParams,
  customerId
) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize } = queryParams;
  // let { firstName, type } = filter;
  // let customerType = typeof type === 'undefined' ? '' : type.toString();

  return SaleAPI.getCustomerSalesHistory(pageNumber, pageSize, customerId)
    .then(sales => {
      let { totalCount, entities } = sales;
      dispatch(actions.salesHistoryForCustomer({ totalCount, entities }));
    })
    .catch(error => {
      console.log("ActionError", error);
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDebtsHistoryForCustomer = (
  queryParams,
  customerId
) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize } = queryParams;
  // let { firstName, type } = filter;
  // let customerType = typeof type === 'undefined' ? '' : type.toString();

  return SaleAPI.getCustomerDebtsHistory(pageNumber, pageSize, customerId)
    .then(sales => {
      let { totalCount, entities } = sales;
      dispatch(
        actions.debtsHistoryForCustomer({
          totalDebtCount: totalCount,
          debtEntities: entities
        })
      );
    })
    .catch(error => {
      console.log("ActionError", error);
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchSalesForDebt = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return SaleAPI.getSalesForDebt(pageNumber, pageSize, firstName, customerType)
    .then(sales => {
      let { totalCount, entities } = sales;
      dispatch(actions.salesForDebtFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchSale = id => dispatch => {
  if (!id) {
    return dispatch(actions.saleFetched({ saleForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return SaleAPI.getSale(id)
    .then(sale => {
      dispatch(actions.saleFetched({ saleForEdit: sale }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
