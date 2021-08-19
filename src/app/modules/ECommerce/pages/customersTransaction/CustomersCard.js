import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import * as actions from '../../_redux/sales/salesActions';
import * as customerActions from '../../_redux/customers/customersActions';
import * as stocksEntryActions from '../../_redux/stocksEntry/stocksEntryActions';
import * as Yup from 'yup';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../_metronic/_partials/controls';
import {
  CustomerStatusTitles,
  CustomerTypeUnits,
  CustomerTransactionType,
} from './CustomersUIHelpers';
import { Formik } from 'formik';
import { CustomersFilter } from './customers-filter/CustomersFilter';
import { CustomersTable } from './customers-table/CustomersTable';
import { CustomersGrouping } from './customers-grouping/CustomersGrouping';
import { useCustomersUIContext } from './CustomersUIContext';
import { useHistory, useLocation } from 'react-router-dom';
import helperFuns from '../utils/helper.funcs';

let customerId;

export function CustomersCard(props) {
  const [cusId, setCusId] = useState();
  const [disabled, setDisabled] = useState(true);
  const [showTransactionCode, setShowTransactionCode] = useState(false);
  const [validateTransactions, setValidateTransactions] = useState({
    transactionType: '',
    transactionStatus: '',
  });
  const customersUIContext = useCustomersUIContext();
  const history = useHistory();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      newCustomerButtonClick: customersUIContext.newCustomerButtonClick,
      productsSelected: customersUIContext.productsSelected,
    };
  }, [customersUIContext]);

  const { customerForEdit } = useSelector((state) => ({
    customerForEdit: state.customers.customerForEdit,
  }));

  const validateFinishSale = useCallback(() => {
    const checkProduct = customersUIProps.productsSelected.some(
      (item) => item.product
    );
    validateTransactions.transactionType && checkProduct && setDisabled(false);
  });

  // Sales Redux state
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    try {
      if (location && location.state.id) {
        customerId = location.state.id;
      }
    } catch (e) {}
    validateFinishSale();
  }, [
    customersUIProps.productsSelected,
    validateTransactions,
    validateFinishSale,
    cusId,
    location,
  ]);

  useEffect(() => {
    dispatch(customerActions.fetchCustomer(customerId));
  }, [customerId]);

  const getClasses = () => {
    let classes = `col-lg-`;
    showTransactionCode ? (classes += 3) : (classes += 4);
    return classes;
  };

  const saveSale = async (values, resetForm) => {
    let _newValues = { ...values };

    let _date = helperFuns.transformDateStringToDateType(_newValues.date);

    let _newProductsSelected = [...customersUIProps.productsSelected];
    let grossTotal = 0;
    _newProductsSelected.map((prod) => {
      let _newProd = Object.assign({}, prod);
      _newProd.productId = helperFuns.transformHexStringToObjectId(
        _newProd.productId
      );
      grossTotal += _newProd.totalAmount;
    });

    let saveSale = {
      products: _newProductsSelected,
      customer_id: customerId,
      total_amount: grossTotal,
      transaction_type: _newValues.transaction_type,
      transaction_code: _newValues.transaction_code,
      date: new Date(_date),
    };

    try {
      const isStocksEntryDecrementedResponse = await stocksEntryActions.getIsStocksEntryDecrementedResponse(
        _newProductsSelected
      );
      if (isStocksEntryDecrementedResponse) {
        dispatch(actions.createSale(saveSale));
        resetForm({ values: '' });

        history.push('/e-commerce/sales');
      } else {
        return false;
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const transactionTypeSchema = Yup.object().shape({
    transaction_type: Yup.string().required('Transaction type is required!'),
    date: Yup.date().required('Date is required.'),
  });

  return (
    <Card>
      <CardHeader
        title={
          customerForEdit &&
          `Customer: ${customerForEdit.first_name} ${customerForEdit.last_name}`
        }
      >
        <CardHeaderToolbar>
          <Formik
            initialValues={{
              transaction_type: '',
              // status: '',
              transaction_code: '',
              date: '',
            }}
            enableReinitialize={true}
            validationSchema={transactionTypeSchema}
            onSubmit={(values, { resetForm }) => {
              saveSale(values, resetForm);
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
              <form onSubmit={handleSubmit} className="form form-label-right">
                <div className="form-group row">
                  <div className={getClasses()}>
                    <select
                      className="form-control"
                      placeholder="Transaction type"
                      name="transaction_type"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        setFieldValue('transaction_type', e.target.value);
                        setValidateTransactions({
                          ...validateTransactions,
                          transactionType: e.target.value,
                        });

                        if (e.target.value === '3') {
                          setShowTransactionCode(true);
                        } else {
                          setShowTransactionCode(false);
                        }
                      }}
                      value={values.transaction_type}
                    >
                      {CustomerTransactionType.map((tranType, index) => (
                        <option key={tranType} value={index}>
                          {tranType}
                        </option>
                      ))}
                    </select>
                    {errors.transaction_type && touched.transaction_type ? (
                      <div style={{ color: 'red' }}>
                        {errors.transaction_type}
                      </div>
                    ) : null}
                    <small className="form-text text-muted">
                      <b>Transaction type</b>
                    </small>
                  </div>

                  {showTransactionCode && (
                    <div className={getClasses()}>
                      <input
                        type="text"
                        className="form-control"
                        name="transaction_code"
                        placeholder="Transaction Code"
                        onBlur={handleBlur}
                        value={values.transaction_code}
                        onChange={(e) => {
                          setFieldValue('transaction_code', e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Transaction Code</b>
                      </small>
                    </div>
                  )}

                  <div className={getClasses()}>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      placeholder="Date"
                      onBlur={handleBlur}
                      value={values.date}
                      onChange={(e) => {
                        setFieldValue('date', e.target.value);
                      }}
                    />
                    {errors.date && touched.date ? (
                      <div style={{ color: 'red' }}>{errors.date}</div>
                    ) : null}
                    <small className="form-text text-muted">
                      <b>Date</b>
                    </small>
                  </div>

                  <div className={getClasses()}>
                    <button
                      type="submit"
                      style={{ display: 'block' }}
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
