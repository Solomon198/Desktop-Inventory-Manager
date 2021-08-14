// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  product_name: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Model is required")
});

export function ProductEditForm({
  product,
  supplierEntities,
  btnRef,
  saveProduct
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={values => {
          saveProduct(values);
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
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-6">
                  <input
                    className="form-control"
                    name="product_name"
                    value={values.product_name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Product Name"
                  />
                  <small className="form-text text-muted">
                    <b>Product</b>
                  </small>
                  {errors.product_name && touched.product_name ? (
                    <div style={{ color: "red" }}>{errors.product_name}</div>
                  ) : null}
                </div>
                <div className="col-lg-6">
                  <select
                    name="supplier_id"
                    className="form-control"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  >
                    <option value="">Select Supplier</option>
                    {supplierEntities &&
                      supplierEntities.map(entity => (
                        <option key={entity._id} value={entity._id}>
                          {entity.supplier_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="form-group row"></div>
              <div className="form-group">
                <label>Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className="form-control"
                />
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
