// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
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
    .required('Firstname is required'),
  last_name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Lastname is required'),
  // email: Yup.string()
  //   .email("Invalid email")
  //   .required("Email is required"),
  phone_no: Yup.number().required('Phone Number is required'),
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
                  <div className="col-lg-4">
                    <Field
                      name="first_name"
                      component={Input}
                      placeholder="First Name"
                      label="First Name"
                    />
                  </div>
                  {/* Last Name */}
                  <div className="col-lg-4">
                    <Field
                      name="last_name"
                      component={Input}
                      placeholder="Last Name"
                      label="Last Name"
                    />
                  </div>
                  {/* Mobile */}
                  <div className="col-lg-4">
                    <Field
                      name="phone_no"
                      component={Input}
                      placeholder="Mobile"
                      label="Mobile"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  {/* Email */}
                  <div className="col-lg-4">
                    <Field
                      type="email"
                      name="email"
                      component={Input}
                      placeholder="Email"
                      label="Email"
                    />
                  </div>
                  {/* Gender */}
                  <div className="col-lg-4">
                    <Select name="gender" label="Gender">
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </Select>
                  </div>
                  {/* Address */}
                  <div className="col-lg-4">
                    <Field
                      name="address"
                      component={Input}
                      placeholder="Address"
                      label="Address"
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
