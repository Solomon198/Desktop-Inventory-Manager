import React from "react";
// import { useSelector, useDispatch } from 'react-redux';
import { Route } from "react-router-dom";
import { CustomersLoadingDialog } from "./customers-loading-dialog/CustomersLoadingDialog";
import { CustomerEditDialog } from "./customer-edit-dialog/CustomerEditDialog";
import { CustomerDeleteDialog } from "./customer-delete-dialog/CustomerDeleteDialog";
import { CustomersDeleteDialog } from "./customers-delete-dialog/CustomersDeleteDialog";
import { CustomersFetchDialog } from "./customers-fetch-dialog/CustomersFetchDialog";
import { CustomersUpdateStateDialog } from "./customers-update-status-dialog/CustomersUpdateStateDialog";
import { CustomersUIProvider } from "./CustomersUIContext";
import { CustomersCard } from "./CustomersCard";

export function RolesPage({ history }) {
  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push("/e-commerce/roles/new");
    },
    openEditCustomerDialog: id => {
      history.push(`/e-commerce/roles/${id}/edit`);
    },
    openDeleteCustomerDialog: id => {
      history.push(`/e-commerce/roles/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/roles/deleteRoles`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/roles/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push("/e-commerce/roles/updateStatus");
    },
    viewCustomerProfileButtonClick: id => {
      history.push(`/e-commerce/customer-profile/${id}/view`);
    }
  };

  return (
    <>
      <CustomersUIProvider customersUIEvents={customersUIEvents}>
        <CustomersLoadingDialog />
        <Route path="/e-commerce/roles/new">
          {({ history, match }) => (
            <CustomerEditDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/roles");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/roles/:id/edit">
          {({ history, match }) => (
            <CustomerEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/e-commerce/roles");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/roles/deleteRoles">
          {({ history, match }) => (
            <CustomersDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/roles");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/roles/:id/delete">
          {({ history, match }) => (
            <CustomerDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/e-commerce/roles");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/roles/fetch">
          {({ history, match }) => (
            <CustomersFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/roles");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/roles/updateStatus">
          {({ history, match }) => (
            <CustomersUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/roles");
              }}
            />
          )}
        </Route>
        {/* <Route path="/e-commerce/customer/:id/view">
        {({ history, match }) => (
          <CustomerProfile
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push('/e-commerce/roles')}
          />
        )}
      </Route> */}
        <CustomersCard />
      </CustomersUIProvider>
    </>
  );
}
