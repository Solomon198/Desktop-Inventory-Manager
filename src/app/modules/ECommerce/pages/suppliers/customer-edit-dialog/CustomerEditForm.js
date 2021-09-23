// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as moment from 'moment';
import * as Yup from 'yup';
import {
  Input,
  Select,
  DatePickerField,
} from '../../../../../../_metronic/_partials/controls';
import helperFuncs from '../../utils/helper.funcs';
// Validation schema
const CustomerEditSchema = Yup.object().shape({
  supplier_name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Supplier name is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  address: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Address is required'),
  phone_no: Yup.number().required('Phone Number is required'),
  date: Yup.date().required('Date is required'),
});

export function CustomerEditForm({
  saveSupplier,
  supplier,
  actionsLoading,
  onHide,
}) {
  supplier = typeof supplier === 'object' ? supplier : {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={supplier}
        validationSchema={CustomerEditSchema}
        onSubmit={(values) => {
          saveSupplier(values);
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
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
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
