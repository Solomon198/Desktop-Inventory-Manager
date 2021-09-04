/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from '../../../../../_metronic/_partials/controls';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import * as actions from '../../_redux/debtsManager/debtsManagerActions';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnOutlined';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import CustomerDebtPaymentForm from './customer-debt-payment/CustomerDebtPaymentForm';
import AlertDialog from '../../../../../_metronic/_partials/controls/AlertDialog';
import helperFuncs from '../utils/helper.funcs';

export function CustomerProfileAccount({
  actionsLoading,
  customer,
  customerTransactions,
}) {
  const [showPayDebtBtn, setShowPayDebtBtn] = useState(true);
  const [showDebtPaymentForm, setShowDebtPaymentForm] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [amount, setAmount] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {}, [amount, showPayDebtBtn, showDebtPaymentForm, dispatch]);

  if (!customer) {
    return null;
  }

  let customerTransactionId;
  let totalOutstanding;
  if (customerTransactions && customerTransactions.length > 0) {
    customerTransactionId = customerTransactions[0]._id;
    totalOutstanding = customerTransactions[0].total_outstanding;
  }

  const handlePayDebtBtn = () => {
    setShowPayDebtBtn(false);
    setShowDebtPaymentForm(true);
  };

  const handleBtnClick = () => {
    let $amount;
    try {
      $amount = helperFuncs.removeSymbolFromNumber(amount);
      $amount = parseInt($amount);
      totalOutstanding = helperFuncs.transformCurrencyStringToNumber(
        totalOutstanding
      );
    } catch (e) {
      console.log(e);
    }
    if (!($amount > totalOutstanding)) {
      let transactionToUpdate = {
        _id: customerTransactionId,
        customer_id: customer._id,
        amount,
      };
      dispatch(actions.updateCustomerTransaction(transactionToUpdate));
      setAmount('');
      setShowPayDebtBtn(true);
      setShowDebtPaymentForm(false);
    } else {
      setAmount(
        helperFuncs.transformCurrencyStringToNumber(amount).toLocaleString()
      );
      return setShowAlertDialog(true);
    }
  };

  const handleOnCancelClick = () => {
    setAmount('');
    setShowPayDebtBtn(true);
    setShowDebtPaymentForm(false);
  };

  const handleOnChange = (e) => {
    setAmount(e.target.value);
  };

  const handleOnCloseDialog = () => {
    setShowAlertDialog(false);
  };
  return (
    <>
      {actionsLoading && (
        <div className="overlay-layer bg-transparent">
          <div className="spinner spinner-lg spinner-success" />
        </div>
      )}
      <Card>
        <div
          className="d-flex align-items-center mb-5 justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
          style={{
            backgroundImage: `url(${toAbsoluteUrl('/media/misc/bg-1.jpg')})`,
          }}
        >
          <div className="symbol bg-white-o-15 mr-3">
            <span className="symbol-label text-success font-weight-bold font-size-h4">
              {customer.first_name[0]}
            </span>
            {/* <img src={toAbsoluteUrl('/media/users/300_21.jpg')} alt="" /> */}
          </div>
          <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
            {customer.first_name} {customer.last_name}
          </div>
        </div>

        {/* <div className="navi navi-spacer-x-0 pt-5"> */}
        <div className="container pb-8">
          {/* <Link to="/user-profile" className="navi-item px-8 cursor-pointer"> */}
          <div className="d-flex my-5">
            <div className="navi-icon mr-2">
              <i className="flaticon2-phone text-primary" />
            </div>
            <div className="navi-text">
              <div className="font-weight-bold cursor-pointer">Phone</div>
              <div className="text-muted">
                <span>{customer.phone_no}</span>
              </div>
            </div>
          </div>
          {/* </Link> */}

          {/* <a className="navi-item px-8"> */}
          <div className="d-flex mb-5">
            <div className="navi-icon mr-2">
              <i className="flaticon2-mail text-warning"></i>
            </div>
            <div className="navi-text">
              <div className="font-weight-bold">Email</div>
              <div className="text-muted">{customer.email}</div>
            </div>
          </div>
          {/* </a> */}

          <div className="d-flex mb-5">
            <div className="navi-icon mr-2">
              <i className="flaticon2-calendar-3 text-danger"></i>
            </div>
            <div className="navi-text">
              <div className="font-weight-bold">Address</div>
              <div className="text-muted">{customer.address}</div>
            </div>
          </div>
          <br />

          {customerTransactions &&
            customerTransactions.map((transaction) => (
              <div key={transaction._id}>
                <hr />
                <div className="d-flex mb-5">
                  <div className="navi-icon mr-2">
                    <MonetizationOnRoundedIcon color="primary" />
                  </div>
                  <div className="navi-text">
                    <div className="font-weight-bold">Total Amount Paid</div>
                    <div
                      className="text-primary"
                      style={{ fontSize: '16px', fontWeight: 'bold' }}
                    >
                      {transaction.total_amount}
                    </div>
                  </div>
                </div>

                <div className="d-flex mb-5">
                  <div className="navi-icon mr-2">
                    <AccountBalanceWalletIcon
                      style={{
                        color:
                          transaction.total_outstanding !== '₦0.00'
                            ? 'red'
                            : 'green',
                      }}
                    />
                  </div>
                  <div className="navi-text">
                    <div className="font-weight-bold">Total Debt</div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color:
                          transaction.total_outstanding !== '₦0.00'
                            ? 'red'
                            : 'green',
                      }}
                    >
                      {transaction.total_outstanding}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {customerTransactions &&
            customerTransactions.length > 0 &&
            showPayDebtBtn &&
            customerTransactions[0].total_outstanding !== '₦0.00' && (
              <>
                <hr />
                <div className="text-center">
                  <button
                    onClick={handlePayDebtBtn}
                    style={{
                      backgroundImage: `url(${toAbsoluteUrl(
                        '/media/misc/bg-1.jpg'
                      )})`,
                      border: 'none',
                    }}
                    className="btn-lg text-white"
                  >
                    Pay Debt
                  </button>
                </div>
              </>
            )}

          {showDebtPaymentForm && (
            <>
              <hr />
              <CustomerDebtPaymentForm
                name="amount"
                val={amount}
                onChange={handleOnChange}
                onButtonClick={handleBtnClick}
                onCancelClick={handleOnCancelClick}
              />
            </>
          )}
        </div>

        <AlertDialog
          open={showAlertDialog}
          modalTitle="Error"
          modalBody="Sorry, the amount entered must not exceed the total money owed by the customer. Consider entering an amount lower than the customer's total outstanding."
          onCloseDialog={handleOnCloseDialog}
        />
      </Card>
    </>
  );
}
