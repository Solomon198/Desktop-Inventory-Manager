import * as requestFromServer from "./salesCrud";
import { salesSlice, callTypes } from "./salesSlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = salesSlice;
const SaleAPI = Queries.SaleAPI;

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

// export const createSale = (saleForCreation) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return ProductAPI.createSale(saleForCreation)
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
