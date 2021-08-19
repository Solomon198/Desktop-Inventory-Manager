import * as requestFromServer from './productsCrud';
import { productsSlice, callTypes } from './productsSlice';
import Queries from '../../../../../dist/realm/queries/index';
const { actions } = productsSlice;
const ProductAPI = Queries.ProductAPI;

export const fetchProducts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { product_name } = filter;

  return ProductAPI.getProducts(pageNumber, pageSize, product_name)
    .then((products) => {
      let { totalCount, entities } = products;
      dispatch(actions.productsFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchProductsForSale = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { product_name } = filter;

  return ProductAPI.getProductsForSale(pageNumber, pageSize, product_name)
    .then((products) => {
      let { totalCount, entities } = products;
      dispatch(actions.productsForSaleFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchProduct = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.productFetched({ productForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return ProductAPI.getProduct(id)
    .then((product) => {
      dispatch(actions.productFetched({ productForEdit: product }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteProduct = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ProductAPI.removeProduct(id)
    .then((result) => {
      dispatch(actions.productDeleted({ id }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createProduct = (productForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ProductAPI.createProduct(productForCreation)
    .then((product) => {
      dispatch(actions.productCreated({ product }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateProduct = (product) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ProductAPI.updateProduct(product)
    .then((product) => {
      dispatch(actions.productUpdated({ product }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteProducts = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return ProductAPI.removeProducts(ids)
    .then(() => {
      dispatch(actions.productsDeleted({ ids }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
