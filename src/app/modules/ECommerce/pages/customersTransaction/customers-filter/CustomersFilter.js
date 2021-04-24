import React, { useMemo, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useCustomersUIContext } from '../CustomersUIContext';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/products/productsActions';
import * as saleActions from '../../../_redux/sales/salesActions';

const prepareFilter = (queryParams, values) => {
  const { status, type, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  // Filter by status
  filter.status = status !== '' ? +status : undefined;
  // Filter by type
  filter.type = type !== '' ? +type : undefined;
  // Filter by all fields
  filter.lastName = searchText;
  if (searchText) {
    filter.firstName = searchText;
    filter.email = searchText;
    filter.ipAddress = searchText;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

const CustomerTransactionSchema = Yup.object().shape({
  unit: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  product: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  quantity: Yup.number()
    .min(1, 'Too Short!')
    .required('Required'),
  amount: Yup.number()
    .min(1, 'Too Short!')
    .required('Required'),
  unit: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

export function CustomersFilter({ listLoading }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      queryParams: customersUIContext.queryParams,
      initTransaction: customersUIContext.initTransaction,
      productsSelected: customersUIContext.productsSelected,
      setProduct: customersUIContext.setProduct,
      itemForEdit: customersUIContext.itemForEdit,
      setItemForEdit: customersUIContext.setItemForEdit,
      insertSale: customersUIContext.insertSale,
      setInsertSale: customersUIContext.setInsertSale,
    };
  }, [customersUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(customersUIProps.queryParams, values);
    if (!isEqual(newQueryParams, customersUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      customersUIProps.setQueryParams(newQueryParams);
    }
  };

  // Getting curret state of products list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.products }),
    shallowEqual
  );
  const { totalCount } = currentState;
  const _products = currentState.entities;
  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // clear selections list
    // productsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchProducts(customersUIProps.queryParams));

    // customersUIProps.setInsertSale(saveSale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // server request for saving customer

  const initialValues = {
    product: '', // values => All=""/Susspended=0/Active=1/Pending=2,
    productId: '',
    quantity: '', // values => All=""/Business=0/Individual=1
    amount: '0',
    unit: '',
    totalAmount: '',
  };

  const _oldEntities = _products;
  const selectedEntities = customersUIProps.productsSelected;
  let entitiesIds = _oldEntities ? _oldEntities.map((val) => val._id) : [];
  let selectedEntitiesIds = selectedEntities.map((val) => val.productId);
  let entities = [];
  let counter = 0;
  for (let item of entitiesIds) {
    let search = selectedEntitiesIds.indexOf(item);

    if (search == -1) {
      entities.push(_oldEntities[counter]);
    }
    counter++;
  }

  console.log(entities);

  const initialValuesForEdit = customersUIProps.itemForEdit;
  return (
    <>
      <Formik
        initialValues={initialValuesForEdit || initialValues}
        enableReinitialize={true}
        validationSchema={CustomerTransactionSchema}
        onSubmit={(values, { resetForm }) => {
          if (initialValues) {
            values.amount = parseInt(values.amount);
            values.quantity = parseInt(values.quantity);

            values.totalAmount = values.amount * values.quantity;
            let productsSelected = [...customersUIProps.productsSelected];
            productsSelected.push(values);
            // console.log(productsSelected);

            // productsSelected.push(values);

            customersUIProps.setProduct(productsSelected);
            resetForm({ values: '' });
          }
          values.totalAmount = values.amount * values.quantity;
          let productsForEdit = { ...customersUIProps.itemForEdit };
          productsForEdit = values;
          let _productForEdit = customersUIProps.productsSelected;
          _productForEdit.push(productsForEdit);

          // customersUIProps.setProduct(_productForEdit);
          resetForm({ values: '' });
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="form-group row">
              <div className="col-lg-2">
                <select
                  className="form-control"
                  placeholder="Product"
                  name="product"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    let productId = e.target.value;
                    if (productId == 'select') return false;
                    let product = {};
                    entities.forEach((item) => {
                      if (item._id == productId) {
                        product = item;
                      }
                    });
                    setFieldValue('product', product.model);
                    setFieldValue('productId', product._id);
                    setFieldValue('amount', product.price);
                  }}
                  value={values.productId}
                >
                  <option value="select">Select product</option>
                  {entities &&
                    entities.map((product, index) => (
                      <option value={product._id}>{product.model}</option>
                    ))}
                </select>
                <small className="form-text text-muted">
                  <b>Product</b>
                </small>
                {errors.product && touched.product ? (
                  <div style={{ color: 'red' }}>{errors.product}</div>
                ) : null}
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  name="amount"
                  placeholder="Amount"
                  onBlur={handleBlur}
                  disabled={true}
                  value={values.amount}
                  onChange={(e) => {
                    setFieldValue('amount', e.target.value);
                  }}
                />
                <small className="form-text text-muted">
                  <b>Amount</b>
                </small>
                {errors.amount && touched.amount ? (
                  <div style={{ color: 'red' }}>{errors.amount}</div>
                ) : null}
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  name="quantity"
                  placeholder="Quantity"
                  // onBlur={handleBlur}
                  value={values.quantity}
                  onChange={(e) => {
                    setFieldValue('quantity', e.target.value);
                  }}
                />
                <small className="form-text text-muted">
                  <b>Quantity</b>
                </small>
                {errors.quantity && touched.quantity ? (
                  <div style={{ color: 'red' }}>{errors.quantity}</div>
                ) : null}
              </div>

              <div className="col-lg-2">
                <select
                  className="form-control"
                  placeholder="Unit"
                  name="type"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('unit', e.target.value);
                  }}
                  value={values.unit}
                >
                  <option value="">Select Unit</option>
                  <option value="pack">Pack</option>
                  <option value="pieces">Pieces</option>
                  <option value="dozen">Dozen</option>
                  <option value="card">Card</option>
                </select>
                <small className="form-text text-muted">
                  <b>Unit</b>
                </small>
                {errors.unit && touched.unit ? (
                  <div style={{ color: 'red' }}>{errors.unit}</div>
                ) : null}
              </div>
              <div className="col-lg-2">
                <button
                  type="submit"
                  style={{ display: 'block' }}
                  className="btn btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
