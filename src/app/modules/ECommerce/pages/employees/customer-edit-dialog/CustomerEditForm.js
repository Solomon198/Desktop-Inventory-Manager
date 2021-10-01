// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as moment from "moment";
import * as Yup from "yup";
import {
  Input,
  Select,
  DatePickerField
} from "../../../../../../_metronic/_partials/controls";
import helperFuncs from "../../../../../../dist/realm/utils/helpers.func";
// Validation schema
const EmployeeEditSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Firstname is required")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  last_name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Lastname is required")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  gender: Yup.string().required("Gender is required"),
  role_id: Yup.string().required("Role is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  default_password: Yup.string().required(
    "Provide a default password of this employee"
  ),
  phone_no: Yup.number()
    .typeError("Phone Number must be a number")
    .positive('Phone Number must not contain the "-" symbol')
    .required("Phone Number is required"),
  home_address: Yup.string()
    .required("Home address is required")
    .matches(/(?!^\d+$)^.+$/, "Only numbers are not allowed for this field"),
  date: Yup.date().required("Date is required")
});

export function EmployeeEditForm({
  saveEmployee,
  employee,
  roleEntities,
  actionsLoading,
  onHide
}) {
  employee = typeof employee === "object" ? employee : {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={employee}
        validationSchema={EmployeeEditSchema}
        onSubmit={values => {
          saveEmployee(values);
          // console.log(values);
          // alert('Hello');
        }}
      >
        {({
          values,
          handleSubmit,
          handleChange,
          handleBlur,
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
                  {/* Gender */}
                  <div className="col-lg-4">
                    <Select name="gender" label="Gender">
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </Select>
                  </div>
                </div>
                <div className="form-group row">
                  {/* Home Address */}
                  <div className="col-lg-12">
                    <label>Home Address</label>
                    <Field
                      // as="textarea"
                      name="home_address"
                      className="form-control"
                      component={Input}
                      placeholder="Home Address"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  {/* Mobile */}
                  <div className="col-lg-4">
                    <Field
                      name="phone_no"
                      component={Input}
                      placeholder="Mobile"
                      label="Mobile"
                    />
                  </div>
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
                  {/* Login */}
                  <div className="col-lg-4">
                    <Field
                      type="password"
                      name="default_password"
                      component={Input}
                      placeholder="Default Password"
                      label="Default Password"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  {/* Type */}
                  <div className="col-lg-6">
                    <Select name="role_id" label="Role">
                      <option value="">Select Role</option>
                      {roleEntities &&
                        roleEntities.length > 0 &&
                        roleEntities.map(role => (
                          <option key={role._id} value={role._id}>
                            {role.role_name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className="col-lg-6">
                    <label>Date</label>
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
