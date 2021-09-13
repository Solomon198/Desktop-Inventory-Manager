// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import * as moment from "moment";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  DatePickerField
} from "../../../../../../_metronic/_partials/controls";
import helperFuncs from "../../../../../../dist/realm/utils/helpers.func";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/expensesItem/expensesItemActions";
import helperFuns from "../../utils/helper.funcs";
import { useCustomersUIContext } from "../CustomersUIContext";

// Validation schema
const ExpenseEditSchema = Yup.object().shape({
  expense_item_id: Yup.string()
    .min(2, "Mininum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Expense is required"),
  amount: Yup.string().required("Amount is required"),
  // .min(1, '₦1 is minimum')
  // .max(1000000, '₦1000000 is maximum')
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required")
});

export function CustomerEditForm({
  saveExpense,
  expense,
  actionsLoading,
  onHide
}) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      tab: customersUIContext.tab
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
    state => ({
      currentState: state.expensesItem
    }),
    shallowEqual
  );
  const { totalCount, entities } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchExpensesItem(customersUIProps.queryParams));

    // customersUIProps.setInsertSale(saveSale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customersUIProps.tab]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={expense}
        validationSchema={ExpenseEditSchema}
        onSubmit={(values, { resetForm }) => {
          saveExpense(values, resetForm);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
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
                  <div className="col-lg-12">
                    <div className="form-group">
                      <select
                        className="form-control"
                        placeholder="Expense"
                        name="expense_item_id"
                        onBlur={handleBlur}
                        onChange={e => {
                          let selectedExpenseItemId = e.target.value;
                          if (selectedExpenseItemId === "select") return false;
                          let expenseItem = {};
                          entities.map(prod => {
                            if (prod._id === selectedExpenseItemId) {
                              expenseItem = prod;
                            }
                          });
                          setFieldValue("expense_item_id", expenseItem._id);
                          setFieldValue("expense_item", expenseItem.item);
                          // setProductId(expenseItem._id);
                          // productId
                          //   ? setDisabledUnit(false)
                          //   : setDisabledUnit(true);
                        }}
                        value={values.expense_item_id}
                      >
                        <option value="select">Select Expense</option>
                        {entities &&
                          entities.map((val, index) => (
                            <option key={val._id} value={val._id}>
                              {val.item}
                            </option>
                          ))}
                      </select>
                      <small className="form-text text-muted">
                        <b>Expense</b>
                      </small>
                      {errors.expense_item_id && touched.expense_item_id ? (
                        <div style={{ color: "red" }}>
                          {errors.expense_item_id}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="amount"
                        placeholder="Amount"
                        onBlur={handleBlur}
                        // disabled={true}
                        value={helperFuns
                          .transformCurrencyStringToNumber(values.amount)
                          .toLocaleString()}
                        onChange={e => {
                          setFieldValue("amount", e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Amount</b>
                      </small>
                      {errors.amount && touched.amount ? (
                        <div style={{ color: "red" }}>{errors.amount}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <Field
                        name="description"
                        placeholder="Enter Description here..."
                        as="textarea"
                        className="form-control"
                      />
                      <small className="form-text text-muted">
                        <b>Description</b>
                      </small>
                      {errors.description && touched.description ? (
                        <div style={{ color: "red" }}>{errors.description}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        placeholder="Date"
                        onBlur={handleBlur}
                        value={values.date}
                        onChange={e => {
                          setFieldValue("date", e.target.value);
                        }}
                        max={moment().format("YYYY-MM-DD")}
                      />
                      <small className="form-text text-muted">
                        <b>Date</b>
                      </small>
                      {errors.date && touched.date ? (
                        <div style={{ color: "red" }}>{errors.date}</div>
                      ) : null}
                    </div>
                  </div>
                  {/* <div className="col-lg-12">
                    <div className="form-group">
                      <button
                        type="submit"
                        style={{ display: "block" }}
                        className="btn btn-primary"
                        // disabled={disabled}
                      >
                        Finish sale
                      </button>
                    </div>
                  </div> */}
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
