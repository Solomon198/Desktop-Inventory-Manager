// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  DatePickerField
} from "../../../../../../_metronic/_partials/controls";
import helperFuncs from "../../../../../../dist/realm/utils/helpers.func";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as stockActions from "../../../_redux/stocks/stocksActions";
import * as actions from "../../../_redux/products/productsActions";
import * as unitActions from "../../../_redux/units/unitsActions";
import helperFuns from "../../utils/helper.funcs";
import { useCustomersUIContext } from "../CustomersUIContext";

// Validation schema
const CustomerEditSchema = Yup.object().shape({
  product_id: Yup.string()
    .min(2, "Mininum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Product is required"),
  unit_id: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Unit is required"),
  product_name: Yup.string()
    .min(2, "Mininum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Product is required"),
  unit_name: Yup.string()
    .min(2, "Mininum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Product is required"),
  quantity: Yup.number()
    .min(1, "Minimum 3 symbols")
    .required("Quantity is required"),
  date: Yup.date().required("Date is required")
});

export function CustomerEditForm({ saveStock, stock, actionsLoading, onHide }) {
  const [productId, setProductId] = useState();
  const [disabledUnit, setDisabledUnit] = useState(true);

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      tab: customersUIContext.tab
      // queryParams: customersUIContext.queryParams,
      // initTransaction: customersUIContext.initTransaction,
      // productsSelected: customersUIContext.productsSelected,
      // setProduct: customersUIContext.setProduct,
      // itemForEdit: customersUIContext.itemForEdit,
      // setItemForEdit: customersUIContext.setItemForEdit,
      // insertSale: customersUIContext.insertSale,
      // setInsertSale: customersUIContext.setInsertSale,
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
  // const { totalCount, entities } = productCurrentState;
  // const { totalCount, entities } = unitCurrentState;
  //   const _products = currentState.entities;
  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // clear selections list
    // productsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchProducts(customersUIProps.queryParams));
    dispatch(unitActions.fetchUnitsForProduct(productId));

    // customersUIProps.setInsertSale(saveSale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customersUIProps.tab, productId, disabledUnit]);

  // const saveStock = (values, resetForm) => {
  //   let newValues = { ...values };
  //   let _date = helperFuns.transformDateStringToDateType(newValues.date);

  //   let _saveStock = {
  //     product_id: newValues.product_id,
  //     unit_id: newValues.unit_id,
  //     product_name: newValues.product_name,
  //     unit_name: newValues.unit_name,
  //     quantity: newValues.quantity,
  //     date: new Date(_date),
  //   };

  //   // console.log(_saveStock);
  //   dispatch(stockActions.createStock(_saveStock));
  //   resetForm({ values: '' });
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={stock}
        validationSchema={CustomerEditSchema}
        onSubmit={(values, { resetForm }) => {
          saveStock(values, resetForm);
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
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
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
                          setFieldValue("product_name", product.model);
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
                              {product.model}
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
                        placeholder="Unit"
                        name="unit_id"
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
                        type="text"
                        className="form-control"
                        name="quantity"
                        placeholder="Quantity"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.quantity}
                        onChange={e => {
                          setFieldValue("quantity", e.target.value);
                          console.log(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Quantity</b>
                      </small>
                      {errors.quantity && touched.quantity ? (
                        <div style={{ color: "red" }}>{errors.quantity}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        placeholder="Date"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.date}
                        onChange={e => {
                          setFieldValue("date", e.target.value);
                          console.log(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Date</b>
                      </small>
                      {errors.date && touched.date ? (
                        <div style={{ color: "red" }}>{errors.date}</div>
                      ) : null}
                    </div>
                  </div>
                  {/* <div className="col-lg-12">
                    <div className="form-group">
                      <button
                        type="submit"
                        style={{ display: "block" }}
                        className="btn btn-primary"
                        // disabled={disabled}
                      >
                        Finish sale
                      </button>
                    </div>
                  </div> */}
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
                Save
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
