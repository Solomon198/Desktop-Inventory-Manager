// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Input,
  Select,
  DatePickerField,
} from '../../../../../../_metronic/_partials/controls';
import helperFuncs from '../../../../../../dist/realm/utils/helpers.func';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/expensesItem/expensesItemActions';
import helperFuns from '../../utils/helper.funcs';
import { useCustomersUIContext } from '../CustomersUIContext';

export function ExpensesItemForm({ actionsLoading, onHide }) {
  //   customer = typeof customer === 'object' ? customer : {};

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      // queryParams: customersUIContext.queryParams,
      // initTransaction: customersUIContext.initTransaction,
      // productsSelected: customersUIContext.productsSelected,
      // setProduct: customersUIContext.setProduct,
      // itemForEdit: customersUIContext.itemForEdit,
      // setItemForEdit: customersUIContext.setItemForEdit,
      // insertSale: customersUIContext.insertSale,
      // setInsertSale: customersUIContext.setInsertSale,
    };
  }, [customersUIContext]);

  // Getting curret state of expenses item list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.expensesItem }),
    shallowEqual
  );
  const { totalCount, entities } = currentState;
  console.log(entities);
  // Expenses Item Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    // clear selections list
    // productsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchExpensesItem(customersUIProps.queryParams));

    // customersUIProps.setInsertSale(saveSale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Validation schema
  const ExpenseItemSchema = Yup.object().shape({
    item: Yup.string()
      .min(2, 'Minimum 2 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Expense name is required'),
  });

  const saveExpenseItem = (values, { resetForm }) => {
    let _newValues = { ...values };

    dispatch(actions.createExpenseItem(_newValues));

    resetForm({ values: '' });
  };

  return (
    <>
      <Formik
        initialValues={{
          item: '',
        }}
        enableReinitialize={true}
        validationSchema={ExpenseItemSchema}
        onSubmit={(values, resetForm) => {
          saveExpenseItem(values, resetForm);
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
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="item"
                        placeholder="Expense"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={values.item}
                        onChange={(e) => {
                          setFieldValue('item', e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Expense</b>
                      </small>
                      {errors.item && touched.item ? (
                        <div style={{ color: 'red' }}>{errors.item}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <button
                        type="submit"
                        style={{ display: 'block' }}
                        className="btn btn-primary"
                        // disabled={disabled}
                      >
                        Add Expense
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </Modal.Body>
            {/* <Modal.Footer>
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
            </Modal.Footer> */}
          </>
        )}
      </Formik>
    </>
  );
}
