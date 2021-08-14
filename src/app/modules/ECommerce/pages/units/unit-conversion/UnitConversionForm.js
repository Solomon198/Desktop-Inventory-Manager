import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import * as actions from "../../../_redux/products/productsActions";
import * as unitActions from "../../../_redux/units/unitsActions";
import { useCustomersUIContext } from "../CustomersUIContext";

export function UnitConversionForm({ show, onHide }) {
  const [unitConversionState, setUnitConversionState] = useState({
    productId: null,
    convertFrom: 0,
    convertTo: 0,
    showConvertFromQty: null,
    showConvertToQty: null,
    convertFromQty: 0,
    conveertToQty: 0
  });
  const [productId, setProductId] = useState("");
  const [disabledUnit, setDisabledUnit] = useState(true);

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      tab: customersUIContext.tab
    };
  }, [customersUIContext]);

  // Getting curret state of products list from store (Redux)
  const { productCurrentState, unitCurrentState } = useSelector(
    state => ({
      productCurrentState: state.products,
      unitCurrentState: state.units
    }),
    shallowEqual
  );

  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // server call by queryParams
    dispatch(actions.fetchProducts(customersUIProps.queryParams));
    dispatch(unitActions.fetchUnitsForProduct(productId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customersUIProps.tab, productId, disabledUnit]);

  const initialValues = {
    product_id: "",
    unit1: "",
    qty1: "",
    unit2: "",
    qty2: ""
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      //   validationSchema={CustomerEditSchema}
      onSubmit={(values, { resetForm }) => {
        // saveStock(values, resetForm);
        console.log(values);
      }}
    >
      {({
        values,
        handleSubmit,
        handleBlur,
        handleChange,
        setFieldValue,
        errors,
        touched
      }) => (
        <>
          <Modal show={show} onHide={onHide}>
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
                        onChange={e => {
                          let selectedProductId = e.target.value;
                          if (selectedProductId === "select") return false;
                          let product = {};
                          productCurrentState.entities.map(prod => {
                            if (prod._id === selectedProductId) {
                              product = prod;
                            }
                          });
                          setFieldValue("product_id", product._id);
                          setFieldValue("product_name", product.product_name);
                          setProductId(product._id);
                          productId
                            ? setDisabledUnit(false)
                            : setDisabledUnit(true);
                        }}
                        value={values.product_id}
                      >
                        <option value="select">Select product</option>
                        {productCurrentState.entities &&
                          productCurrentState.entities.map((product, index) => (
                            <option key={product._id} value={product._id}>
                              {product.product_name}
                            </option>
                          ))}
                      </select>
                      <small className="form-text text-muted">
                        <b>Product</b>
                      </small>
                      {errors.product_id && touched.product_id ? (
                        <div style={{ color: "red" }}>{errors.product_id}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <select
                        className="form-control"
                        placeholder="Convert From"
                        name="unit1"
                        // disabled={disabledUnit}
                        onBlur={handleBlur}
                        onChange={e => {
                          let selectedUnitId = e.target.value;
                          if (selectedUnitId === "select") return false;
                          let unitObj = {};
                          unitCurrentState.entities.map(unit => {
                            if (unit._id === selectedUnitId) {
                              unitObj = unit;
                            }
                          });
                          setFieldValue("unit_id", unitObj._id);
                          setFieldValue("unit_name", unitObj.name);
                        }}
                        value={values.unit_id}
                      >
                        <option value="select">Select unit</option>
                        {unitCurrentState.entities &&
                          unitCurrentState.entities.map((unit, index) => (
                            <option key={unit._id} value={unit._id}>
                              {unit.name}
                            </option>
                          ))}
                      </select>
                      <small className="form-text text-muted">
                        <b>Unit</b>
                      </small>
                      {errors.unit_id && touched.unit_id ? (
                        <div style={{ color: "red" }}>{errors.unit_id}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-control"
                        name="qty1"
                        placeholder="Quantity 1"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.qty1}
                        onChange={e => {
                          setFieldValue("quantity", e.target.value);
                          console.log(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Quantity 1</b>
                      </small>
                      {errors.quantity && touched.quantity ? (
                        <div style={{ color: "red" }}>{errors.quantity}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <select
                        className="form-control"
                        placeholder="Convert To"
                        name="unit2"
                        // disabled={disabledUnit}
                        onBlur={handleBlur}
                        onChange={e => {
                          let selectedUnitId = e.target.value;
                          if (selectedUnitId === "select") return false;
                          let unitObj = {};
                          unitCurrentState.entities.map(unit => {
                            if (unit._id === selectedUnitId) {
                              unitObj = unit;
                            }
                          });
                          setFieldValue("unit_id", unitObj._id);
                          setFieldValue("unit_name", unitObj.name);
                        }}
                        value={values.unit_id}
                      >
                        <option value="select">Select unit</option>
                        {unitCurrentState.entities &&
                          unitCurrentState.entities.map((unit, index) => (
                            <option key={unit._id} value={unit._id}>
                              {unit.name}
                            </option>
                          ))}
                      </select>
                      <small className="form-text text-muted">
                        <b>Unit</b>
                      </small>
                      {errors.unit_id && touched.unit_id ? (
                        <div style={{ color: "red" }}>{errors.unit_id}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-control"
                        name="qty2"
                        placeholder="Quantity 2"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.qty1}
                        onChange={e => {
                          setFieldValue("quantity", e.target.value);
                          console.log(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Quantity 2</b>
                      </small>
                      {errors.quantity && touched.quantity ? (
                        <div style={{ color: "red" }}>{errors.quantity}</div>
                      ) : null}
                    </div>
                  </div>
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
