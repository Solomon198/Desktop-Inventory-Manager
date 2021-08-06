import * as requestFromServer from "./stocksEntryCrud";
import { stocksEntrySlice, callTypes } from "./stocksEntrySlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = stocksEntrySlice;
const StockEntryAPI = Queries.StockEntryAPI;

export const createStockEntry = stockForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockEntryAPI.createStockEntry(stockForCreation)
    .then(stockEntry => {
      dispatch(actions.stockEntryCreated({ stockEntry }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchStocksEntry = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return StockEntryAPI.getStocksEntry(
    pageNumber,
    pageSize,
    firstName,
    customerType
  )
    .then(stocks => {
      let { totalCount, entities } = stocks;
      dispatch(actions.stocksEntryFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchStockEntry = id => dispatch => {
  if (!id) {
    return dispatch(
      actions.stockEntryFetched({ stockEntryForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return StockEntryAPI.getStockEntry(id)
    .then(stockEntry => {
      dispatch(actions.stockEntryFetched({ stockEntryForEdit: stockEntry }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchQuantityByUnitId = unitId => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  return StockEntryAPI.getQuantityByUnitId(unitId)
    .then(stockEntry => {
      let { totalCount, entities } = stockEntry;
      dispatch(actions.stockEntryQuantityFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// export const getIsOutOfStocksEntryResponse = (stocksEntry) => {
//   console.log('StockEntry', stocksEntry);
//   return async function getResponse() {
//     try {
//       let isOutOfStocksEntry = await StockEntryAPI.isOutOfStocksEntry(
//         stocksEntry
//       );
//       console.log('isOutOfStocksEntry', isOutOfStocksEntry);
//       if (isOutOfStocksEntry) return true;
//       return false;
//     } catch (e) {
//       return e.message;
//     }
//   };
// };

export const getIsOutOfStocksEntryResponse = async stocksEntry => {
  console.log("StockEntry", stocksEntry);
  try {
    let isOutOfStocksEntry = await StockEntryAPI.isOutOfStocksEntry(
      stocksEntry
    );
    console.log("isOutOfStocksEntry", isOutOfStocksEntry);
    if (isOutOfStocksEntry) return true;
    return false;
  } catch (e) {
    return e.message;
  }
};

export const deleteStockEntry = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockEntryAPI.removeStockEntry(id)
    .then(result => {
      dispatch(actions.stockEntryDeleted({ id }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateStockEntry = stockEntry => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockEntryAPI.updateStockEntry(stockEntry)
    .then(stockEntry => {
      dispatch(actions.stockEntryUpdated({ stockEntry }));
    })
    .catch(error => {
      console.log(error);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const getIsStocksEntryDecrementedResponse = async stocksEntry => {
  try {
    const isStocksEntryDecremented = await StockEntryAPI.decrementStocksEntry(
      stocksEntry
    );
    if (isStocksEntryDecremented) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.message);
  }
};

export const deleteStocksEntry = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return StockEntryAPI.removeStocksEntry(ids)
    .then(() => {
      dispatch(actions.stocksEntryDeleted({ ids }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
