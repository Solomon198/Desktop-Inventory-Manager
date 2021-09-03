/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Card } from "../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

export function CustomerProfileAccount({
  actionsLoading,
  customer,
  customerTransactions
}) {
  if (!customer) {
    return null;
  }
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
            backgroundImage: `url(${toAbsoluteUrl("/media/misc/bg-1.jpg")})`
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
          <hr />

          {customerTransactions &&
            customerTransactions.map(transaction => (
              <>
                <div className="d-flex mb-5">
                  <div className="navi-icon mr-2">
                    <AttachMoneyIcon color="primary" />
                  </div>
                  <div className="navi-text">
                    <div className="font-weight-bold">Total Sales</div>
                    <div
                      className="text-primary"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      {transaction.total_amount}
                    </div>
                  </div>
                </div>

                <div className="d-flex mb-5">
                  <div className="navi-icon mr-2">
                    <AccountBalanceWalletIcon style={{ color: "orangered" }} />
                  </div>
                  <div className="navi-text">
                    <div className="font-weight-bold">Total Debt</div>
                    <div
                      className="text-danger"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      {transaction.total_outstanding}
                    </div>
                  </div>
                </div>
              </>
            ))}

          <hr />
          {customerTransactions && customerTransactions.length > 0 && (
            <div className="text-center">
              <button className="btn-lg btn-primary">Pay Debt</button>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
