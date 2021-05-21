import React from "react";
import { Route } from "react-router-dom";
import { CustomersLoadingDialog } from "./customers-loading-dialog/CustomersLoadingDialog";
import { CustomerEditDialog } from "./customer-edit-dialog/CustomerEditDialog";
import { CustomerDeleteDialog } from "./customer-delete-dialog/CustomerDeleteDialog";
import { CustomersDeleteDialog } from "./customers-delete-dialog/CustomersDeleteDialog";
import { CustomersFetchDialog } from "./customers-fetch-dialog/CustomersFetchDialog";
import { CustomersUpdateStateDialog } from "./customers-update-status-dialog/CustomersUpdateStateDialog";
import { CustomersUIProvider } from "./CustomersUIContext";
import { CustomersCard } from "./CustomersCard";

export function ExpensesPage({ history }) {
  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push("/e-commerce/expenses/new");
    },
    openEditCustomerDialog: id => {
      history.push(`/e-commerce/expenses/${id}/edit`);
    },
    openDeleteCustomerDialog: id => {
      history.push(`/e-commerce/expenses/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/expenses/deleteCustomers`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/expenses/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push("/e-commerce/expenses/updateStatus");
    }
  };

  return (
    <CustomersUIProvider customersUIEvents={customersUIEvents}>
      <CustomersLoadingDialog />
      <Route path="/e-commerce/expenses/new">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/expenses/:id/edit">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/expenses/deleteCustomers">
        {({ history, match }) => (
          <CustomersDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/expenses/:id/delete">
        {({ history, match }) => (
          <CustomerDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/expenses/fetch">
        {({ history, match }) => (
          <CustomersFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/expenses/updateStatus">
        {({ history, match }) => (
          <CustomersUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <CustomersCard />
    </CustomersUIProvider>
  );
}
