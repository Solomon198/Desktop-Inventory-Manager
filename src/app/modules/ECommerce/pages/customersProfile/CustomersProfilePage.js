import React, { useEffect, useMemo } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { isEqual, isFunction } from "lodash";
import * as actions from "../../_redux/customers/customersActions";
import * as transactionActions from "../../_redux/debtsManager/debtsManagerActions";
import { Route } from "react-router-dom";
import { CustomersLoadingDialog } from "./customers-loading-dialog/CustomersLoadingDialog";
import { CustomerEditDialog } from "./customer-edit-dialog/CustomerEditDialog";
import { CustomerDeleteDialog } from "./customer-delete-dialog/CustomerDeleteDialog";
import { CustomersDeleteDialog } from "./customers-delete-dialog/CustomersDeleteDialog";
import { CustomersFetchDialog } from "./customers-fetch-dialog/CustomersFetchDialog";
import { CustomersUpdateStateDialog } from "./customers-update-status-dialog/CustomersUpdateStateDialog";
import { CustomersUIProvider } from "./CustomersUIContext";
import { CustomersCard } from "./CustomersCard";
import { CustomerProfile } from "./customer-profile/CustomerProfile";
import { CustomersTable } from "./customers-table/CustomersTable";
import { CustomerDebtsPaymentHistoryTable } from "./customer-debts-payment-history/CustomersTable";
import { CustomerProfileHeader } from "./customerProfileHeader";
import { CustomerProfileAccount } from "./customerProfileAccount";
import { CustomerDebtHistoryItems } from "./customer-debts-history-table/CustomersTable";
import { CustomerDebtItems } from "./customer-debts-history-table/CustomerDebtItemsTable";

export function CustomersProfilePage({
  history,
  match: {
    params: { id }
  }
}) {
  const {
    actionsLoading,
    customerForEdit,
    debtError,
    debtForEdit
  } = useSelector(
    state => ({
      actionsLoading: state.customers.actionsLoading,
      customerForEdit: state.customers.customerForEdit,
      debtError: state.debtsManager.error,
      debtForEdit: state.debtsManager.debtForEdit
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchCustomer(id));
    dispatch(transactionActions.fetchCustomerTransaction(id));
  }, [id, dispatch]);

  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push("/e-commerce/customer-profile/new");
    },
    openEditCustomerDialog: id => {
      history.push(`/e-commerce/customer-profile/${id}/edit`);
    },
    openDeleteCustomerDialog: id => {
      history.push(`/e-commerce/customer-profile/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/customer-profile/deleteCustomers`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/customer-profile/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push("/e-commerce/customer-profile/updateStatus");
    },
    viewCustomerDebtItems: debtId => {
      history.push(`/e-commerce/customer-debt-items/${debtId}/view`);
    }
  };

  return (
    <>
      <CustomersUIProvider customersUIEvents={customersUIEvents}>
        <CustomerProfileHeader history={history} customer={customerForEdit} />
        <div className="row">
          <div className="col-md-4">
            <CustomerProfileAccount
              actionsLoading={actionsLoading}
              error={debtError}
              customer={customerForEdit && customerForEdit}
              customerTransactions={debtForEdit && debtForEdit}
            />
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-12">
                <CustomersTable customerId={id} />
              </div>
              <div className="col-md-12">
                <CustomerDebtHistoryItems customerId={id} />
              </div>
              <div className="col-md-12">
                <CustomerDebtsPaymentHistoryTable customerId={id} />
              </div>
            </div>
          </div>
        </div>
      </CustomersUIProvider>
    </>
  );
}
