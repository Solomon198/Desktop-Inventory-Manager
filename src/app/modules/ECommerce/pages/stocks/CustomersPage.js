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

export function StocksPage({ history }) {
  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push("/e-commerce/stocks/new");
    },
    openEditCustomerDialog: id => {
      history.push(`/e-commerce/stocks/${id}/edit`);
    },
    openDeleteCustomerDialog: id => {
      history.push(`/e-commerce/stocks/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/stocks/deleteCustomers`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/stocks/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push("/e-commerce/stocks/updateStatus");
    }
  };

  return (
    <CustomersUIProvider customersUIEvents={customersUIEvents}>
      <CustomersLoadingDialog />
      <Route path="/e-commerce/stocks/new">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/stocks");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/stocks/:id/edit">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/stocks");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/stocks/deleteCustomers">
        {({ history, match }) => (
          <CustomersDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/stocks");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/stocks/:id/delete">
        {({ history, match }) => (
          <CustomerDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/stocks");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/stocks/fetch">
        {({ history, match }) => (
          <CustomersFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/stocks");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/stocks/updateStatus">
        {({ history, match }) => (
          <CustomersUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/stocks");
            }}
          />
        )}
      </Route>
      <CustomersCard />
    </CustomersUIProvider>
  );
}
