import * as requestFromServer from "./unitsCrud";
import { unitsSlice, callTypes } from "./unitsSlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = unitsSlice;
const UnitAPI = Queries.UnitAPI;

// export const fetchSales = (queryParams) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.list }));

//   let { pageNumber, pageSize, filter } = queryParams;
//   let { firstName, type } = filter;
//   let customerType = typeof type === 'undefined' ? '' : type.toString();

//   return ProductAPI.getCustomers(pageNumber, pageSize, firstName, customerType)
//     .then((products) => {
//       let { totalCount, entities } = products;
//       dispatch(actions.productsFetched({ totalCount, entities }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

// export const fetchProduct = (id) => (dispatch) => {
//   if (!id) {
//     return dispatch(actions.productFetched({ productForEdit: undefined }));
//   }

//   dispatch(actions.startCall({ callType: callTypes.action }));

//   return ProductAPI.getProduct(id)
//     .then((product) => {
//       dispatch(actions.productFetched({ productForEdit: product }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const createUnit = (unitForCreation) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ProductAPI.createUnit(unitForCreation)
//     .then((product) => {
//       dispatch(actions.productCreated({ product }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const updateProduct = (productUpdates) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ProductAPI.updateProduct(productUpdates)
//     .then((product) => {
//       dispatch(actions.productUpdated({ product }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const deleteProduct = (id) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ProductAPI.removeProduct(id)
//     .then((result) => {
//       dispatch(actions.productDeleted({ id }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

export const createUnit = unitForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return UnitAPI.createUnit(unitForCreation)
    .then(unit => {
      dispatch(actions.unitCreated({ unit }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchUnits = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === "undefined" ? "" : type.toString();

  return UnitAPI.getUnits(pageNumber, pageSize, firstName, customerType)
    .then(units => {
      let { totalCount, entities } = units;
      dispatch(actions.unitsFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUnitsForProduct = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  // let { pageNumber, pageSize, filter } = queryParams;
  // let { firstName, type } = filter;
  // let customerType = typeof type === "undefined" ? "" : type.toString();

  return UnitAPI.getUnitsForProduct(id)
    .then(units => {
      let { totalCount, entities } = units;
      dispatch(actions.unitsForProductFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// export const fetchSalesForDebt = queryParams => dispatch => {
//   dispatch(actions.startCall({ callType: callTypes.list }));

//   let { pageNumber, pageSize, filter } = queryParams;
//   let { firstName, type } = filter;
//   let customerType = typeof type === "undefined" ? "" : type.toString();

//   return SaleAPI.getSalesForDebt(pageNumber, pageSize, firstName, customerType)
//     .then(sales => {
//       let { totalCount, entities } = sales;
//       dispatch(actions.salesForDebtFetched({ totalCount, entities }));
//     })
//     .catch(error => {
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

// export const fetchSale = id => dispatch => {
//   if (!id) {
//     return dispatch(actions.saleFetched({ saleForEdit: undefined }));
//   }

//   dispatch(actions.startCall({ callType: callTypes.action }));

//   return SaleAPI.getSale(id)
//     .then(sale => {
//       dispatch(actions.saleFetched({ saleForEdit: sale }));
//     })
//     .catch(error => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const deleteProduct = (id) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ProductAPI.removeProduct(id)
//     .then((result) => {
//       dispatch(actions.productDeleted({ id }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const updateProduct = (product) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ProductAPI.updateProduct(product)
//     .then((product) => {
//       console.log(product);
//       dispatch(actions.productUpdated({ product }));
//     })
//     .catch((error) => {
//       console.log(error);
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const updateProductsStatus = (ids, status) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .updateStatusForProducts(ids, status)
//     .then(() => {
//       dispatch(actions.productsStatusUpdated({ ids, status }));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't update products status";
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const deleteProducts = (ids) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ProductAPI.removeProducts(ids)
//     .then(() => {
//       dispatch(actions.productsDeleted({ ids }));
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };
