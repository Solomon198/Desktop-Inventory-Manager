// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useEffect, useMemo } from "react";
import * as moment from "moment";
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
import * as actions from "../../../_redux/products/productsActions";
import * as unitActions from "../../../_redux/units/unitsActions";
import helperFuns from "../../utils/helper.funcs";
import { useCustomersUIContext } from "../CustomersUIContext";
import { setSnackbar } from "../../../_redux/snackbar/snackbarActions";

export function UnitForm({ actionsLoading, onHide }) {
  //   customer = typeof customer === 'object' ? customer : {};

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams
    };
  }, [customersUIContext]);

  // Getting curret state of products list from store (Redux)
  const { error, currentState } = useSelector(
    state => ({
      error: state.products.error,
      currentState: state.products
    }),
    shallowEqual
  );
  const { totalCount, entities } = currentState;
  //   const _products = currentState.entities;
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

  // Validation schema
  const UnitSchema = Yup.object().shape({
    product_id: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Product is required"),
    name: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Unit name is required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
    price: Yup.string().required("Price is required"),
    date: Yup.date().required("Date is required")
  });

  const saveUnit = (values, resetForm) => {
    let _newValues = { ...values };
    _newValues.product_id = helperFuns.transformHexStringToObjectId(
      _newValues.product_id
    );

    dispatch(unitActions.createUnit(_newValues));
    dispatch(
      setSnackbar({
        status: !error ? "success" : "error",
        message: (
          <p style={{ fontSize: "16px" }}>
            {!error ? `Unit created successfully!` : error}
          </p>
        ),
        show: true
      })
    );
    resetForm({ values: "" });
  };

  return (
    <>
      <Formik
        initialValues={{
          product_id: "",
          name: "",
          bulk_size: "0",
          price: "0",
          date: ""
        }}
        enableReinitialize={true}
        validationSchema={UnitSchema}
        onSubmit={(values, { resetForm }) => {
          saveUnit(values, resetForm);
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
                  <div className="col-lg-4">
                    <div className="form-group">
                      <select
                        className="form-control"
                        placeholder="Product"
                        name="product_id"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.product_id}
                      >
                        <option value="select">Select product</option>
                        {entities &&
                          entities.map((product, index) => (
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
                  <div className="col-lg-4">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Unit Name"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.name}
                        onChange={e => {
                          setFieldValue("name", e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Unit Name</b>
                      </small>
                      {errors.name && touched.name ? (
                        <div style={{ color: "red" }}>{errors.name}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="bulk_size"
                        placeholder="Bulk Size"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.bulk_size}
                        onChange={e => {
                          setFieldValue("bulk_size", e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Bulk Size</b>
                      </small>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="price"
                        placeholder="Price"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={helperFuns
                          .transformCurrencyStringToNumber(values.price)
                          .toLocaleString()}
                        onChange={e => {
                          setFieldValue("price", e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Price Per Unit</b>
                      </small>
                      {errors.price && touched.price ? (
                        <div style={{ color: "red" }}>{errors.price}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        onBlur={handleBlur}
                        value={values.date}
                        onChange={e => setFieldValue("date", e.target.value)}
                        className="form-control"
                        max={moment().format("YYYY-MM-DD")}
                      />
                      <small className="form-text text-muted">
                        <b>Date</b>
                      </small>
                      {errors.date && touched.date ? (
                        <div style={{ color: "red" }}>{errors.date}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <button
                        type="submit"
                        style={{ display: "block" }}
                        className="btn btn-primary"
                        // disabled={disabled}
                      >
                        Add Unit
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </Modal.Body>
            {/* <Modal.Footer>
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
            </Modal.Footer> */}
          </>
        )}
      </Formik>
    </>
  );
}
