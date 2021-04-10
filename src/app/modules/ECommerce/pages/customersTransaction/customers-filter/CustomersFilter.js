import React, { useMemo, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { isEqual } from 'lodash';
import { useCustomersUIContext } from '../CustomersUIContext';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/products/productsActions';

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

export function CustomersFilter({ listLoading }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      queryParams: customersUIContext.queryParams,
      productsSelected: customersUIContext.productsSelected,
      setProduct: customersUIContext.setProduct,
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
  const { totalCount, entities } = currentState;
  // Products Redux state
  console.log(entities);
  const [lastSelected, setSelected] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    // productsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchProducts(customersUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Formik
        initialValues={{
          product: '', // values => All=""/Susspended=0/Active=1/Pending=2,
          productId: '',
          quantity: '', // values => All=""/Business=0/Individual=1
          amount: '0',
          unit: '',
          totalAmount: '',
        }}
        onSubmit={(values) => {
          console.log(values);
          // applyFilter(values);
          values.totalAmount = values.amount * values.quantity;
          let productsSelected = [...customersUIProps.productsSelected];
          productsSelected.push(values);
          console.log(productsSelected);
          customersUIProps.setProduct(productsSelected);
          // console.log(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
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
                    let index = parseInt(e.target.value);
                    let productSelected = entities[index];
                    setSelected(index);
                    setFieldValue('product', productSelected.model);
                    setFieldValue('productId', productSelected._id);
                    setFieldValue('amount', productSelected.price);
                  }}
                  value={lastSelected}
                >
                  {entities &&
                    entities.map((product, index) => (
                      <option value={index}>{product.model}</option>
                    ))}
                </select>
                <small className="form-text text-muted">
                  <b>Product</b>
                </small>
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
                    setFieldValue('totalAmount', values.totalAmount);
                  }}
                />
                <small className="form-text text-muted">
                  <b>Amount</b>
                </small>
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
                  <option value="pack">Pack</option>
                  <option value="pieces">Pieces</option>
                  <option value="dozen">Dozen</option>
                  <option value="card">Card</option>
                </select>
                <small className="form-text text-muted">
                  <b>Unit</b>
                </small>
              </div>
              <div className="col-lg-2">
                <button type="submit" className="btn btn-primary">
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
