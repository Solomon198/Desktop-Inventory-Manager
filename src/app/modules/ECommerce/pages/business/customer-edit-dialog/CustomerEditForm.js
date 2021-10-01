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
import { toAbsoluteUrl } from '../../../../../../_metronic/_helpers';
import helperFuncs from '../../../../../../dist/realm/utils/helpers.func';
import { Avatar } from '@material-ui/core';
// import CameraIcon from '@mui/icons-material/Camera';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
// Validation schema
const CustomerEditSchema = Yup.object().shape({
  business_name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Business Name is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  email: Yup.string()
    .email('Invalid Email')
    .required('Email is required'),
  phone_no: Yup.number()
    .typeError('Phone Number must be a number')
    .positive('Phone Number must not contain the minus "-" symbol')
    .integer(`Phone Number can't include a decimal point`)
    .required('Phone Number is required'),
  description: Yup.string().required('Provide your Business Tagline'),
  address: Yup.string()
    .required('Address is required')
    .matches(/(?!^\d+$)^.+$/, 'Only numbers are not allowed for this field'),
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
        {({
          values,
          handleSubmit,
          handleChange,
          handleBlur,
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
                <div
                  className="form-group row"
                  style={{ marginBottom: '48px' }}
                >
                  <div className="col-lg-6 offset-5">
                    <label htmlFor="business_logo">
                      <input
                        type="file"
                        id="business_logo"
                        name="business_logo"
                        style={{ display: 'none' }}
                      />
                      <Avatar
                        alt="Business Logo"
                        src={`${toAbsoluteUrl('/media/logos/dixre-logo.jpg')}`}
                        style={{
                          width: 100,
                          height: 100,
                          border: '1px solid #e3e3e3',
                          borderShadow: '2px 3px 10px 6px rgba(0,0,0,0.36)',
                        }}
                      />
                      <Avatar
                        style={{
                          position: 'absolute',
                          top: '70%',
                          right: '70%',
                          cursor: 'pointer',
                        }}
                      >
                        <CameraAltIcon />
                      </Avatar>
                    </label>
                  </div>
                </div>
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
                    <label>Date</label>
                    <input
                      name="date"
                      type="date"
                      placeholder="Select Date"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.date}
                      max={moment().format('YYYY-MM-DD')}
                    />
                    {errors.date && touched.date ? (
                      <div className="text-danger">{errors.date}</div>
                    ) : null}
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
                    {errors.address && touched.address ? (
                      <div className="text-danger">{errors.address}</div>
                    ) : null}
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
                    {errors.description && touched.description ? (
                      <div className="text-danger">{errors.description}</div>
                    ) : null}
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
