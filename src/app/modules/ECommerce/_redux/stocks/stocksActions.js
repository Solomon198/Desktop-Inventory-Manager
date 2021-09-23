import * as requestFromServer from "./stocksCrud";
import { stocksSlice, callTypes } from "./stocksSlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = stocksSlice;
const StockAPI = Queries.StockAPI;

export const createStock = stockForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockAPI.createStock(stockForCreation)
    .then(stock => {
      dispatch(actions.stockCreated({ stock }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchStocks = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  console.log(queryParams);
  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return StockAPI.getStocks(pageNumber, pageSize, firstName, customerType)
    .then(stocks => {
      let { totalCount, entities } = stocks;
      dispatch(actions.stocksFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchFilteredProducts = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return StockAPI.getFilterProducts(
    pageNumber,
    pageSize,
    firstName,
    customerType
  )
    .then(stocks => {
      let { totalCount, entities } = stocks;
      dispatch(actions.stocksProductsFiltered({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchStock = id => dispatch => {
  if (!id) {
    return dispatch(actions.stockFetched({ stockForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return StockAPI.getStock(id)
    .then(stock => {
      dispatch(actions.stockFetched({ stockForEdit: stock }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteStock = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockAPI.removeStock(id)
    .then(result => {
      dispatch(actions.stockDeleted({ id }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateStock = stock => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockAPI.updateStock(stock)
    .then(stock => {
      dispatch(actions.stockUpdated({ stock }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteStocks = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockAPI.removeStocks(ids)
    .then(() => {
      dispatch(actions.stocksDeleted({ ids }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
