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
const RoleEditSchema = Yup.object().shape({
  role_name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Role Name is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  date: Yup.date().required('Date is required'),
});

export function CustomerEditForm({ saveRole, role, actionsLoading, onHide }) {
  role = typeof role === 'object' ? role : {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={role}
        validationSchema={RoleEditSchema}
        onSubmit={(values) => {
          saveRole(values);
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
                <div className="form-group row">
                  {/* First Name */}
                  <div className="col-lg-12">
                    <Field
                      name="role_name"
                      component={Input}
                      placeholder="Role"
                      label="Role"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  {/* Date */}
                  <div className="col-lg-12">
                    <label>Date</label>
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
                    {errors.date && touched.date ? (
                      <div className="text-danger">{errors.date}</div>
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
