// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from 'react';
import * as moment from 'moment';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import helperFuns from '../../utils/helper.funcs';

// Validation schema
const CustomerDebtPaymentSchema = Yup.object().shape({
  paid_amount: Yup.string().required('This field is required'),
  date: Yup.date().required('Date is required'),
});

export default function CustomerDebtPaymentForm({
  saveDebtPayment,
  initDebtPayment,
  onHide,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initDebtPayment}
        validationSchema={CustomerDebtPaymentSchema}
        onSubmit={(values, { resetForm }) => {
          saveDebtPayment(values, resetForm);
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
                <div className="col-lg-12">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="paid_amount"
                      placeholder="Enter Amount"
                      onBlur={handleBlur}
                      // disabled={true}
                      value={helperFuns
                        .transformCurrencyStringToNumber(values.paid_amount)
                        .toLocaleString()}
                      onChange={(e) => {
                        setFieldValue('paid_amount', e.target.value);
                      }}
                    />
                    <small className="form-text text-muted">
                      <b>Paid Amount</b>
                    </small>
                    {errors.paid_amount && touched.paid_amount ? (
                      <div style={{ color: 'red' }}>{errors.paid_amount}</div>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
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
              </div>
            </Form>
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
          </>
        )}
      </Formik>
    </>
  );
}
