import React, { useState, useEffect, useMemo } from "react";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";
import { Formik } from "formik";
import { CustomersFilter } from "./customers-filter/CustomersFilter";
import { CustomersTable } from "./customers-table/CustomersTable";
import { CustomersGrouping } from "./customers-grouping/CustomersGrouping";
import { useCustomersUIContext } from "./CustomersUIContext";
import { useHistory } from "react-router-dom";
import helperFuns from "../utils/helper.funcs";

export function CustomersCard(props) {
  const [disabled, setDisabled] = useState(true);
  const [validateTransactionType, setValidateTransactionType] = useState("");
  const customersUIContext = useCustomersUIContext();
  const history = useHistory();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      newCustomerButtonClick: customersUIContext.newCustomerButtonClick,
      productsSelected: customersUIContext.productsSelected
    };
  }, [customersUIContext]);

  const validateFinishSale = useCallback(() => {
    const checkProduct = customersUIProps.productsSelected.some(
      item => item.product
    );
    validateTransactionType && checkProduct && setDisabled(false);
  });

  useEffect(() => {
    validateFinishSale();
    console.log("Hey");
  }, [
    customersUIProps.productsSelected,
    validateTransactionType,
    validateFinishSale
  ]);

  // const customerId = props.match.params.id;
  // console.log(customerId);

  const transactionTypeSchema = Yup.object().shape({
    transaction_type: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Transaction type is required."),
    date: Yup.date().required("Date is required.")
  });

  return (
    <Card>
      <CardHeader title="Customers Transaction list">
        <CardHeaderToolbar>
          <Formik
            initialValues={{
              transaction_type: "",
              date: ""
            }}
            enableReinitialize={true}
            validationSchema={transactionTypeSchema}
            onSubmit={(values, { resetForm }) => {
              let _newValues = { ...values };
              let _transactionType = _newValues.transaction_type;
              let _date = _newValues.date;

              let _newProductsSelected = [...customersUIProps.productsSelected];
              let grossTotal = 0;
              _newProductsSelected.map(prod => {
                prod.productId = helperFuns.transformHexStringToObjectId(
                  prod.productId
                );
                grossTotal += prod.totalAmount;
              });

              let saveSale = {
                products: _newProductsSelected,
                // customerId,
                total_amount: grossTotal,
                transaction_type: _transactionType,
                date: _date
              };

              console.log(saveSale);

              // history.push('/e-commerce/sales');

              resetForm({ values: "" });
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
              <form onSubmit={handleSubmit} className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-4">
                    <select
                      className="form-control"
                      placeholder="Transaction type"
                      name="transaction_type"
                      onBlur={handleBlur}
                      onChange={e => {
                        setFieldValue("transaction_type", e.target.value);
                        setValidateTransactionType(e.target.value);
                        validateFinishSale();
                      }}
                      value={values.transaction_type}
                    >
                      <option value="">Select transaction type</option>
                      <option value="cash">cash</option>
                      <option value="credit">Credit</option>
                      <option value="card">Card</option>
                    </select>
                    {errors.transaction_type && touched.transaction_type ? (
                      <div style={{ color: "red" }}>
                        {errors.transaction_type}
                      </div>
                    ) : null}
                    <small className="form-text text-muted">
                      <b>Transaction type</b>
                    </small>
                  </div>
                  <div className="col-lg-4">
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
                    />
                    {errors.date && touched.date ? (
                      <div style={{ color: "red" }}>{errors.date}</div>
                    ) : null}
                    <small className="form-text text-muted">
                      <b>Date</b>
                    </small>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="submit"
                      style={{ display: "block" }}
                      className="btn btn-primary"
                      disabled={disabled}
                    >
                      Finish sale
                    </button>
                  </div>
                </div>
              </form>
            )}
          </Formik>

          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              let _newProductsSelected = [...customersUIProps.productsSelected];
              console.log(_newProductsSelected);
              let grossTotal = 0;
              _newProductsSelected.map((prod) => {
                prod.productId = helperFuns.transformHexStringToObjectId(
                  prod.productId
                );
                grossTotal += prod.totalAmount;
                console.log(typeof productId);
              });

              let saveSale = {
                products: _newProductsSelected,
                // customerId,
                total_amount: grossTotal,
                // transaction_type,
                // date,
              };

              history.push('/e-commerce/sales');
            }}
            // onClick={customersUIProps.newCustomerButtonClick}
          >
            Finish sale
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <CustomersFilter />
        {customersUIProps.ids.length > 0 && <CustomersGrouping />}
        <CustomersTable />
      </CardBody>
    </Card>
  );
}
