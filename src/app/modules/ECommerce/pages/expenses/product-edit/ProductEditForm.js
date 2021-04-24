// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input, Select } from '../../../../../../_metronic/_partials/controls';
import {
  AVAILABLE_COLORS,
  AVAILABLE_MANUFACTURES,
  ProductStatusTitles,
  ProductConditionTitles,
} from '../ProductsUIHelpers';

// Validation schema
const ExpenseEditSchema = Yup.object().shape({
  item: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Item is required'),
  amount: Yup.number()
    .min(1, '₦1 is minimum')
    .max(1000000, '₦1000000 is maximum')
    .required('Amount is required'),
  description: Yup.string().required('Description is required'),
  date: Yup.date().required('Date is required'),
});

export function ProductEditForm({ expense, btnRef, saveExpense }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={expense}
        validationSchema={ExpenseEditSchema}
        onSubmit={(values) => {
          saveExpense(values);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    name="item"
                    component={Input}
                    placeholder="Item"
                    label="Item"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    type="number"
                    name="amount"
                    component={Input}
                    placeholder="Amount"
                    label="Amount (₦)"
                    customFeedbackLabel="Please enter Amount"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    type="date"
                    name="date"
                    component={Input}
                    placeholder="Date"
                    label="Date"
                  />
                </div>
              </div>
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
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
