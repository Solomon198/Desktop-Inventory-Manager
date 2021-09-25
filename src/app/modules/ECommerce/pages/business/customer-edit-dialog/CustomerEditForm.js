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
import helperFuncs from '../../../../../../dist/realm/utils/helpers.func';
// Validation schema
const CustomerEditSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First Name is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  last_name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last Name is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  phone_no: Yup.number()
    .typeError('Phone Number must be a number')
    .positive('Phone Number must not contain the minus "-" symbol')
    .integer(`Phone Number can't include a decimal point`)
    .required('Phone Number is required'),
  date: Yup.date().required('Date is required'),
});

export function CustomerEditForm({
  saveCustomer,
  customer,
  actionsLoading,
  onHide,
}) {
  customer = typeof customer === 'object' ? customer : {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={customer}
        validationSchema={CustomerEditSchema}
        onSubmit={(values) => {
          saveCustomer(values);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <div className="form-group row">
                  {/* First Name */}
                  <div className="col-lg-6">
                    <Field
                      name="business_name"
                      component={Input}
                      placeholder="Business Full Name"
                      label="Business Full Name"
                    />
                  </div>
                  {/* Email */}
                  <div className="col-lg-6">
                    <Field
                      type="email"
                      name="email"
                      component={Input}
                      placeholder="Email"
                      label="Email"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  {/* Mobile */}
                  <div className="col-lg-6">
                    <Field
                      name="phone_no"
                      component={Input}
                      placeholder="Mobile"
                      label="Mobile"
                    />
                  </div>
                  {/* Date */}
                  <div className="col-lg-6">
                    <DatePickerField
                      name="date"
                      label="Date"
                      // max={moment().format('YYYY-MM-DD')}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  {/* Address */}
                  <div className="col-lg-6">
                    <Field
                      as="textarea"
                      name="address"
                      // component={Input}
                      className="form-control"
                      placeholder="Office Address"
                      label="Office Address"
                    />
                  </div>
                  {/* Description */}
                  <div className="col-lg-6">
                    <Field
                      as="textarea"
                      name="description"
                      // component={Input}
                      className="form-control"
                      placeholder="Description (Business Tagline)"
                      label="Description (Business Tagline)"
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
