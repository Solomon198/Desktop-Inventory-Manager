// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import * as moment from "moment";
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
const UnitEditSchema = Yup.object().shape({
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

export function CustomerEditForm({ saveUnit, unit, actionsLoading, onHide }) {
  const [productId, setProductId] = useState();
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
  const { productCurrentState } = useSelector(
    state => ({
      productCurrentState: state.products
    }),
    shallowEqual
  );

  const { entities } = productCurrentState;

  // Products Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // server call by queryParams
    dispatch(actions.fetchProducts(customersUIProps.queryParams));
    // dispatch(unitActions.fetchUnitsForProduct(productId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customersUIProps.tab, productId, disabledUnit]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={unit}
        validationSchema={UnitEditSchema}
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
                  {!unit._id ? (
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
                          <div style={{ color: "red" }}>
                            {errors.product_id}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="col-lg-4">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Unit"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.name}
                        onChange={e => {
                          setFieldValue("name", e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Unit</b>
                      </small>
                      {errors.name && touched.name ? (
                        <div style={{ color: "red" }}>{errors.name}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <input
                        type="number"
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
                      {errors.bulk_size && touched.bulk_size ? (
                        <div style={{ color: "red" }}>{errors.bulk_size}</div>
                      ) : null}
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
                        className="form-control"
                        name="date"
                        placeholder="Select Date"
                        value={values.date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        max={moment().format("YYYY-MM-DD")}
                      />
                      <small className="form-text text-muted">
                        <b>Date</b>
                      </small>
                      {errors.date && touched.date ? (
                        <div className="text-danger">{errors.date}</div>
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
                Save
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
