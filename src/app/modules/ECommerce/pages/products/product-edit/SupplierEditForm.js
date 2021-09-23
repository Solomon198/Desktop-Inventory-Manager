// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from 'react';
import * as moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { DatePickerField } from '../../../../../../_metronic/_partials/controls';
import * as Yup from 'yup';

// Validation schema
const SupplierEditSchema = Yup.object().shape({
  supplier_name: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Supplier name is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  address: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Address is required')
    .matches(/(?!^\d+$)^.+$/, 'Only numbers are not allowed for this field'),
  phone_no: Yup.number()
    .typeError('Phone Number must be a number')
    .positive('Phone Number must not contain the "-" symbol')
    .required('Phone Number is required'),
  date: Yup.date().required('Date is required'),
});

export function SupplierEditForm({
  supplier,
  btnRef,
  saveSupplier,
  backToProductsList,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={supplier}
        validationSchema={SupplierEditSchema}
        onSubmit={(values, { resetForm }) => {
          saveSupplier(values, resetForm);
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
          <>
            <Form className="form form-label-right">
              <div className="form-group row">
                {/* Supplier Name */}
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    name="supplier_name"
                    placeholder="Supplier Name"
                    value={values.supplier_name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <small className="form-text text-muted">
                    <b>Supplier Name</b>
                  </small>
                  {errors.supplier_name && touched.supplier_name ? (
                    <div style={{ color: 'red' }}>{errors.supplier_name}</div>
                  ) : null}
                </div>
                {/* Address */}
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    value={values.address}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="address"
                    placeholder="Address"
                  />
                  <small className="form-text text-muted">
                    <b>Address</b>
                  </small>
                  {errors.address && touched.address ? (
                    <div style={{ color: 'red' }}>{errors.address}</div>
                  ) : null}
                </div>
              </div>
              <div className="form-group row">
                {/* Mobile */}
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    value={values.phone_no}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="phone_no"
                    placeholder="Mobile"
                  />
                  <small className="form-text text-muted">
                    <b>Mobile</b>
                  </small>
                  {errors.phone_no && touched.phone_no ? (
                    <div style={{ color: 'red' }}>{errors.phone_no}</div>
                  ) : null}
                </div>
                {/* Date */}
                <div className="col-lg-6">
                  <DatePickerField
                    name="date"
                    label="date"
                    // max={moment().format('YYYY-MM-DD')}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary mr-2"
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              >
                Add Supplier
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
