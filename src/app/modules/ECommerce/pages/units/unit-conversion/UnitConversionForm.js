import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Formik, Form } from 'formik';
import { Modal } from 'react-bootstrap';
import * as actions from '../../../_redux/products/productsActions';
import * as unitActions from '../../../_redux/units/unitsActions';
import * as stockEntryActions from '../../../_redux/stocksEntry/stocksEntryActions';
import { useCustomersUIContext } from '../CustomersUIContext';
import { UnitConversionHeader } from './UnitConversionHeader';
import { setSnackbar } from '../../../_redux/snackbar/snackbarActions';

export function UnitConversionForm({ id, show, onHide }) {
  const [productId, setProductId] = useState('');

  // Getting curret state of products list from store (Redux)
  const { error, productCurrentState, unitCurrentState } = useSelector(
    (state) => ({
      error: state.units.error,
      productCurrentState: state.products,
      unitCurrentState: state.units,
    }),
    shallowEqual
  );

  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // server call by queryParams
    dispatch(actions.fetchProductsForUnitManager());
    dispatch(unitActions.fetchUnitsForProduct(productId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, productId, id]);

  // method for converting units
  const convertUnit = async (values, resetForm) => {
    // Creating a new copy of values object using Object.assign method
    let unitValues = Object.assign({}, values);

    //getting the IDs for convertFrom & convertTo
    const convertFromUnitId = unitValues.convertFromUnitId;
    const convertToUnitId = unitValues.convertToUnitId;

    // getting the unit object for convertFromUnitId & convertToUnitId
    const convertFromObj = unitCurrentState.entities.find(
      (unit) => unit._id === convertFromUnitId
    );

    const convertToObj = unitCurrentState.entities.find(
      (unit) => unit._id === convertToUnitId
    );

    // checking if convertFromObj has bulk size
    if (convertFromObj.bulk_size) {
      /**
       * If the result holds true, it implies that convertToQty value is set.
       * Hence, we can perform the arithmetic for getting the total quantity
       * to be deducted by multiplying the bulk size computed from convertFromObj
       * by the value/quantity in convertToQty
       */

      const convertToQty = parseInt(unitValues.convertToQty);

      const totalDeduction = convertFromObj.bulk_size * convertToQty;

      // Define the stock entry object for decrementing & incrementing the stock and    // check if it's out of stock
      const deductFromStockEntryObj = {
        unit_id: convertFromUnitId,
        quantity: totalDeduction,
      };

      const addToStockEntryObj = {
        unit_id: convertToUnitId,
        quantity: convertToQty,
      };

      const isOutOfStockResponse = await stockEntryActions.getIsOutOfStocksEntryResponse(
        deductFromStockEntryObj
      );

      if (!isOutOfStockResponse) {
        try {
          const isStockEntryDecrementedResponse = await stockEntryActions.getIsStockEntryDecrementedResponse(
            deductFromStockEntryObj
          );

          const isStockEntryIncrementedResponse = await stockEntryActions.getIsStockEntryIncrementedResponse(
            addToStockEntryObj
          );

          isStockEntryDecrementedResponse && isStockEntryIncrementedResponse
            ? // alert('Unit converted successfully')
              dispatch(
                setSnackbar({
                  status: 'success',
                  message: (
                    <p style={{ fontSize: '16px' }}>
                      Unit converted successfully!
                    </p>
                  ),
                  show: true,
                })
              )
            : // alert('Something went wrong.');
              dispatch(
                setSnackbar({
                  status: 'error',
                  message: (
                    <p style={{ fontSize: '16px' }}>
                      Oops! Something went wrong.
                    </p>
                  ),
                  show: true,
                })
              );
        } catch (e) {
          console.log(e.message);
          dispatch(
            setSnackbar({
              status: 'error',
              message: <p style={{ fontSize: '16px' }}>{e.message}</p>,
              show: true,
            })
          );
        }
      } else {
        // alert('We are out of stock!!!');
        dispatch(
          setSnackbar({
            status: 'info',
            message: (
              <p style={{ fontSize: '16px' }}>
                Ooops! Sorry, you ran out of stock.
              </p>
            ),
            show: true,
          })
        );
      }
    } else {
      /**
       * This condition holds if the unit we wish to convertFrom doesn't have
       * a bulk size. This implies that we are converting from big unit to small unit.
       * This also indicates that value will be set on convertFromQty input field.
       */

      // Get the convertFromQty value and multiply it by convertToUnitId bulk size
      const convertFromQty = parseInt(unitValues.convertFromQty);
      const totalAddition = convertToObj.bulk_size * convertFromQty;

      // Define the stock entry object for decrementing & incrementing the stock and    // check if it's out of stock
      const addToStockEntryObj = {
        unit_id: convertToUnitId,
        quantity: totalAddition,
      };

      const deductFromStockEntryObj = {
        unit_id: convertFromUnitId,
        quantity: convertFromQty,
      };

      // Check if it's not out of stock
      const isOutOfStockResponse = await stockEntryActions.getIsOutOfStocksEntryResponse(
        deductFromStockEntryObj
      );

      if (!isOutOfStockResponse) {
        try {
          const isStockEntryIncrementedResponse = await stockEntryActions.getIsStockEntryIncrementedResponse(
            addToStockEntryObj
          );

          const isStockEntryDecrementedResponse = await stockEntryActions.getIsStockEntryDecrementedResponse(
            deductFromStockEntryObj
          );

          isStockEntryDecrementedResponse && isStockEntryIncrementedResponse
            ? // alert('Unit converted successfully')
              dispatch(
                setSnackbar({
                  status: 'success',
                  message: (
                    <p style={{ fontSize: '16px' }}>
                      Unit converted successfully!
                    </p>
                  ),
                  show: true,
                })
              )
            : // alert('Something went wrong.');
              dispatch(
                setSnackbar({
                  status: 'error',
                  message: (
                    <p style={{ fontSize: '16px' }}>
                      Ooops! Sorry, something went wrong.
                    </p>
                  ),
                  show: true,
                })
              );
        } catch (e) {
          console.log(e.message);
          dispatch(
            setSnackbar({
              status: 'error',
              message: <p style={{ fontSize: '16px' }}>{e.message}</p>,
              show: true,
            })
          );
        }
      } else {
        // alert('We are out of stock!!!');
        dispatch(
          setSnackbar({
            status: 'info',
            message: (
              <p style={{ fontSize: '16px' }}>
                Ooops! Sorry, you ran out of stock.
              </p>
            ),
            show: true,
          })
        );
      }
    }
  };

  const initialValues = {
    product_id: '',
    convertFromUnitId: '',
    convertFromQty: '',
    showConvertFromQty: null,
    convertToUnitId: '',
    convertToQty: '',
    showConvertToQty: null,
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      //   validationSchema={CustomerEditSchema}
      onSubmit={(values, { resetForm }) => {
        convertUnit(values, resetForm);
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
        <>
          <Modal show={show} onHide={onHide}>
            <UnitConversionHeader />
            <Modal.Body className="overlay overlay-block cursor-default">
              {/* {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )} */}
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <select
                        className="form-control"
                        placeholder="Product"
                        name="product_id"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          let selectedProductId = e.target.value;
                          if (selectedProductId === 'select') return false;
                          let product = {};
                          productCurrentState.entities.map((prod) => {
                            if (prod._id === selectedProductId) {
                              product = prod;
                            }
                          });
                          setFieldValue('product_id', product._id);
                          setProductId(product._id);
                        }}
                        value={id ? id : values.product_id}
                      >
                        <option value="select">Select product</option>
                        {productCurrentState.entities &&
                          productCurrentState.entities.map((product, index) => (
                            <option key={product._id} value={product._id}>
                              {product.product_name}
                            </option>
                          ))}
                      </select>
                      <small className="form-text">
                        <b>Product</b>
                      </small>
                      {errors.product_id && touched.product_id ? (
                        <div style={{ color: 'red' }}>{errors.product_id}</div>
                      ) : null}
                    </div>
                  </div>
                  {(id || values.product_id) && (
                    <React.Fragment>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <select
                            className="form-control"
                            placeholder="Convert From"
                            name="convertFromUnitId"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              // validating convertFromUnitId
                              let selectedUnitId = e.target.value;
                              if (selectedUnitId === 'select') return;
                              let unitObj = {};
                              unitCurrentState.entities.map((unit) => {
                                if (unit._id === selectedUnitId) {
                                  unitObj = unit;
                                }
                                return unit;
                              });

                              // Check if the convertToUnitId is not set
                              if (!values.convertToUnitId) {
                                let isShowConvertFromQty = unitObj.bulk_size
                                  ? false
                                  : true;
                                setFieldValue('convertFromUnitId', unitObj._id);
                                setFieldValue(
                                  'showConvertFromQty',
                                  isShowConvertFromQty
                                );
                              } else {
                                let convertToUnitId = values.convertToUnitId;
                                console.log('__cToUnitId__', convertToUnitId);
                                const convertToObj = unitCurrentState.entities.find(
                                  (unit) => unit._id === convertToUnitId
                                );
                                console.log('__cToObj__', convertToObj);

                                if (
                                  convertToObj.bulk_size &&
                                  unitObj.bulk_size
                                ) {
                                  return;
                                }
                                if (
                                  !convertToObj.bulk_size &&
                                  !unitObj.bulk_size
                                ) {
                                  return;
                                }
                                if (
                                  convertToObj.bulk_size &&
                                  !unitObj.bulk_size
                                ) {
                                  setFieldValue(
                                    'convertFromUnitId',
                                    e.target.value
                                  );
                                  setFieldValue('showConvertFromQty', true);
                                }
                                if (
                                  !convertToObj.bulk_size &&
                                  unitObj.bulk_size
                                ) {
                                  setFieldValue(
                                    'convertFromUnitId',
                                    e.target.value
                                  );
                                  setFieldValue('showConvertToQty', true);
                                }
                              }
                            }}
                            value={values.convertFromUnitId}
                          >
                            <option value="select">Select unit</option>
                            {unitCurrentState.entities &&
                              unitCurrentState.entities.map((unit, index) => (
                                <option key={unit._id} value={unit._id}>
                                  {unit.name}
                                </option>
                              ))}
                          </select>
                          <small className="form-text">
                            <b>Convert From</b>
                          </small>
                          {errors.convertFromQty && touched.convertFromQty ? (
                            <div style={{ color: 'red' }}>
                              {errors.convertFromQty}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {values.showConvertFromQty && (
                        <div className="col-lg-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="convertFromQty"
                              placeholder="Quantity"
                              onBlur={handleBlur}
                              // disabled={true}
                              value={values.convertFromQty}
                              onChange={(e) => {
                                setFieldValue('convertFromQty', e.target.value);
                              }}
                            />
                            <small className="form-text">
                              <b>Quantity</b>
                            </small>
                            {errors.convertFromQty && touched.convertFromQty ? (
                              <div style={{ color: 'red' }}>
                                {errors.convertFromQty}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}

                      <div className="col-lg-12">
                        <div className="form-group">
                          <select
                            className="form-control"
                            placeholder="Convert To"
                            name="convertToUnitId"
                            disabled={values.convertFromUnitId ? false : true}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              // validating convertToUnitId
                              let selectedUnitId = e.target.value;
                              if (selectedUnitId === 'select') return false;
                              let unitObj = {};
                              unitCurrentState.entities.map((unit) => {
                                if (unit._id === selectedUnitId) {
                                  unitObj = unit;
                                }
                                return unit;
                              });

                              // using convertFromUnitId to get the corresponding unit object
                              const convertFromUnitId =
                                values.convertFromUnitId;
                              console.log('cFromUnitId', convertFromUnitId);
                              const convertFromObj = unitCurrentState.entities.find(
                                (unit) => unit._id === convertFromUnitId
                              );
                              console.log('cFromObj', convertFromObj);

                              if (
                                convertFromObj.bulk_size &&
                                unitObj.bulk_size
                              ) {
                                return;
                              }

                              if (
                                !convertFromObj.bulk_size &&
                                !unitObj.bulk_size
                              ) {
                                return;
                              }

                              if (
                                convertFromObj.bulk_size &&
                                !unitObj.bulk_size
                              ) {
                                setFieldValue(
                                  'convertToUnitId',
                                  e.target.value
                                );
                                setFieldValue('showConvertToQty', true);
                              }

                              if (
                                !convertFromObj.bulk_size &&
                                unitObj.bulk_size
                              ) {
                                setFieldValue(
                                  'convertToUnitId',
                                  e.target.value
                                );
                                setFieldValue('showConvertFromQty', true);
                              }
                            }}
                            value={values.convertToUnitId}
                          >
                            <option value="select">Select unit</option>
                            {unitCurrentState.entities &&
                              unitCurrentState.entities.map((unit, index) => (
                                <option key={unit._id} value={unit._id}>
                                  {unit.name}
                                </option>
                              ))}
                          </select>
                          <small className="form-text">
                            <b>Convert To</b>
                          </small>
                          {errors.convertToUnitId && touched.convertToUnitId ? (
                            <div style={{ color: 'red' }}>
                              {errors.convertToUnitId}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {values.showConvertToQty && (
                        <div className="col-lg-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="convertToQty"
                              placeholder="Quantity"
                              onBlur={handleBlur}
                              // disabled={true}
                              value={values.convertToQty}
                              onChange={(e) => {
                                setFieldValue('convertToQty', e.target.value);
                              }}
                            />
                            <small className="form-text">
                              <b>Quantity</b>
                            </small>
                            {errors.convertToQty && touched.convertToQty ? (
                              <div style={{ color: 'red' }}>
                                {errors.convertToQty}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              <button
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
                className="btn btn-primary btn-elevate"
              >
                Convert Unit
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Formik>
  );
}
