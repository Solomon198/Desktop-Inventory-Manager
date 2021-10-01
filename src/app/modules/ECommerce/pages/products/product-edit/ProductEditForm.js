// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from 'react';
import { Formik, Form, Field } from 'formik';
import { DatePickerField } from '../../../../../../_metronic/_partials/controls';
import * as moment from 'moment';
import * as Yup from 'yup';

// Validation schema
const ProductEditSchema = Yup.object().shape({
  product_name: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Product name is required')
    .matches(/(?!^\d+$)^.+$/, 'Only numbers are not allowed for this field'),
  date: Yup.date().required('Date is required'),
});

export function ProductEditForm({
  product,
  supplierEntities,
  btnRef,
  saveProduct,
  backToProductsList,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
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
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
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
                    <div style={{ color: 'red' }}>{errors.product_name}</div>
                  ) : null}
                </div>
                <div className="col-lg-4">
                  <select
                    name="supplier_id"
                    className="form-control"
                    value={values.supplier_id}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  >
                    <option value="">Select Supplier</option>
                    {supplierEntities &&
                      supplierEntities.map((entity) => (
                        <option key={entity._id} value={entity._id}>
                          {entity.supplier_name}
                        </option>
                      ))}
                  </select>
                  <small className="form-text text-muted">
                    <b>Supplier</b>
                  </small>
                  {errors.supplier_id && touched.supplier_id ? (
                    <div style={{ color: 'red' }}>{errors.supplier_id}</div>
                  ) : null}
                </div>
                <div className="col-lg-4">
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    placeholder="Select Date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    max={moment().format('YYYY-MM-DD')}
                  />
                  <small className="form-text text-muted">
                    <b>Date</b>
                  </small>
                  {errors.date && touched.date ? (
                    <div className="text-danger">{errors.date}</div>
                  ) : null}
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
                className="btn btn-primary mr-2"
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={backToProductsList}
              >
                Cancel
              </button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
