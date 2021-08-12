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

export function UnitsPage({ history }) {
  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push("/e-commerce/units/new");
    },
    openEditCustomerDialog: id => {
      history.push(`/e-commerce/units/${id}/edit`);
    },
    openDeleteCustomerDialog: id => {
      history.push(`/e-commerce/units/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/units/deleteCustomers`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/units/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push("/e-commerce/units/updateStatus");
    }
  };

  return (
    <CustomersUIProvider customersUIEvents={customersUIEvents}>
      <CustomersLoadingDialog />
      <Route path="/e-commerce/units/new">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/units");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/units/:id/edit">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/units");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/units/deleteCustomers">
        {({ history, match }) => (
          <CustomersDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/units");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/units/:id/delete">
        {({ history, match }) => (
          <CustomerDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/units");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/units/fetch">
        {({ history, match }) => (
          <CustomersFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/units");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/units/updateStatus">
        {({ history, match }) => (
          <CustomersUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/units");
            }}
          />
        )}
      </Route>
      <CustomersCard />
    </CustomersUIProvider>
  );
}
