import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import * as actions from '../../_redux/sales/salesActions';
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

// let customerId;

export function CustomersCard(props) {
  const [cusId, setCusId] = useState();
  const [disabled, setDisabled] = useState(true);
  const [showPartPayment, setShowPartPayment] = useState(false);
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

  const validateFinishSale = useCallback(() => {
    const checkProduct = customersUIProps.productsSelected.some(
      (item) => item.product
    );
    validateTransactions.transactionType &&
      validateTransactions.transactionStatus &&
      checkProduct &&
      setDisabled(false);
  });

  console.log(validateTransactions.transactionType);

  // Sales Redux state
  const dispatch = useDispatch();
  const { actionsLoading, entities, saleForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.sales.actionsLoading,
      entities: state.sales.entities,
    }),
    shallowEqual
  );

  const location = useLocation();

  useEffect(() => {
    // customersUIProps.setIds([]);

    try {
      if (location.state.id) {
        let customerId = location.state.id;
        setCusId(customerId);
        console.log(customerId);
      }
    } catch (e) {}
    validateFinishSale();
  }, [
    customersUIProps.productsSelected,
    validateTransactions,
    validateFinishSale,
    cusId,
  ]);

  const getClasses = () => {
    let classes = `col-lg-`;
    showPartPayment ? (classes += 2) : (classes += 3);
    return classes;
  };

  const saveSale = (values, resetForm) => {
    let _newValues = { ...values };
    let _transactionType = _newValues.transaction_type;
    let _status = _newValues.status;
    // let _partPayment = _newValues.part_payment;

    let _date = helperFuns.transformDateStringToDateType(_newValues.date);

    let _newProductsSelected = [...customersUIProps.productsSelected];
    let grossTotal = 0;
    _newProductsSelected.map((prod) => {
      prod.productId = helperFuns.transformHexStringToObjectId(prod.productId);
      grossTotal += prod.totalAmount;
    });

    let outstanding = 0;
    if (_newValues.part_payment) {
      outstanding = grossTotal - _newValues.part_payment;
    }

    let saveSale = {
      products: _newProductsSelected,
      customer_id: cusId,
      total_amount: grossTotal,
      transaction_type: _transactionType,
      status: _status,
      part_payment: _newValues.part_payment,
      outstanding,
      date: new Date(_date),
    };

    console.log(saveSale);

    dispatch(actions.createSale(saveSale));

    resetForm({ values: '' });

    history.push('/e-commerce/sales');
  };

  // const customerId = props.match.params.id;
  // console.log(customerId);

  const transactionTypeSchema = Yup.object().shape({
    transaction_type: Yup.string().required('Transaction type is required!'),
    status: Yup.string().required('Transaction status is required!'),
    // part_payment: Yup.number().required('Part payment is required!'),
    date: Yup.date().required('Date is required.'),
  });

  return (
    <Card>
      <CardHeader title="Customers Transaction list">
        <CardHeaderToolbar>
          <Formik
            initialValues={{
              transaction_type: '',
              status: '',
              part_payment: 0,
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
                  <div className={getClasses()}>
                    <select
                      className="form-control"
                      placeholder="Transaction Status"
                      name="status"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        setFieldValue('status', e.target.value);
                        setValidateTransactions({
                          ...validateTransactions,
                          transactionStatus: e.target.value,
                        });

                        if (e.target.value === '2') {
                          setShowPartPayment(true);
                        } else {
                          setShowPartPayment(false);
                        }
                      }}
                      value={values.status}
                    >
                      {CustomerStatusTitles.map((status, index) => (
                        <option key={status} value={index}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {errors.status && touched.status ? (
                      <div style={{ color: 'red' }}>{errors.status}</div>
                    ) : null}
                    <small className="form-text text-muted">
                      <b>Transaction Status</b>
                    </small>
                  </div>

                  {showPartPayment && (
                    <div className={getClasses()}>
                      <input
                        type="text"
                        className="form-control"
                        name="part_payment"
                        placeholder="Part Payment"
                        onBlur={handleBlur}
                        value={values.part_payment}
                        onChange={(e) => {
                          setFieldValue('part_payment', e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        <b>Part Payment</b>
                      </small>
                      {errors.part_payment && touched.part_payment ? (
                        <div style={{ color: 'red' }}>
                          {errors.part_payment}
                        </div>
                      ) : null}
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
