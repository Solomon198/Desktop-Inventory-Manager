// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  DatePickerField
} from "../../../../../../_metronic/_partials/controls";
import helperFuncs from "../../../../../../dist/realm/utils/helpers.func";
// Validation schema
const EmployeeEditSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Mininum 2 symbols")
    .max(20, "Maximum 20 symbols")
    .required("Title is required"),
  first_name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Firstname is required"),
  last_name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Lastname is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
  // display_name: Yup.string().required('Username is required'),
  // dateOfBbirth: Yup.mixed()
  //   .nullable(false)
  //   .required("Date of Birth is required"),
  // ip_address: Yup.string().required('IP Address is required'),
});

export function EmployeeEditForm({
  saveEmployee,
  employee,
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
          console.log(values);
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
                  {/* Title */}
                  <div className="col-lg-4">
                    <Field
                      name="title"
                      component={Input}
                      placeholder="Title"
                      label="Title"
                    />
                  </div>
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
                </div>
                {/* Email */}
                <div className="form-group row">
                  {/* Login */}
                  <div className="col-lg-4">
                    <Field
                      name="login"
                      component={Input}
                      placeholder="Login"
                      label="Login"
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      type="email"
                      name="email"
                      component={Input}
                      placeholder="Email"
                      label="Email"
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
                  {/* Date of birth */}
                  {/* <div className="col-lg-4">
                    <DatePickerField
                      name="dateOfBbirth"
                      label="Date of Birth"
                    />
                  </div> */}
                </div>
                <div className="form-group row">
                  {/* IP Address */}
                  <div className="col-lg-4">
                    <Field
                      name="home_address"
                      component={Input}
                      placeholder="Home Address"
                      label="Home Address"
                      customFeedbackLabel="We'll never share employee Home Address with anyone else"
                    />
                  </div>
                  {/* Gender */}
                  <div className="col-lg-4">
                    <Select name="gender" label="Gender">
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </Select>
                  </div>
                  {/* Type */}
                  <div className="col-lg-4">
                    <Select name="role" label="Role">
                      <option value="Super Admin">Super Admin</option>
                      <option value="Accountant">Accountant</option>
                    </Select>
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
