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
import { CustomerProfile } from "./customer-profile/CustomerProfile";

export function BusinessPage({ history }) {
  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push("/e-commerce/business/new");
    },
    openEditCustomerDialog: id => {
      history.push(`/e-commerce/business/${id}/edit`);
    },
    openDeleteCustomerDialog: id => {
      history.push(`/e-commerce/business/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/business/deleteBusiness`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/business/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push("/e-commerce/business/updateStatus");
    },
    viewCustomerProfileButtonClick: id => {
      history.push(`/e-commerce/customer-profile/${id}/view`);
    }
  };

  return (
    <>
      <CustomersUIProvider customersUIEvents={customersUIEvents}>
        <CustomersLoadingDialog />
        <Route path="/e-commerce/business/new">
          {({ history, match }) => (
            <CustomerEditDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/business");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/business/:id/edit">
          {({ history, match }) => (
            <CustomerEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/e-commerce/business");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/business/deleteBusiness">
          {({ history, match }) => (
            <CustomersDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/business");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/business/:id/delete">
          {({ history, match }) => (
            <CustomerDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/e-commerce/business");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/business/fetch">
          {({ history, match }) => (
            <CustomersFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/business");
              }}
            />
          )}
        </Route>
        <Route path="/e-commerce/business/updateStatus">
          {({ history, match }) => (
            <CustomersUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/e-commerce/business");
              }}
            />
          )}
        </Route>
        {/* <Route path="/e-commerce/customer/:id/view">
        {({ history, match }) => (
          <CustomerProfile
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push('/e-commerce/business')}
          />
        )}
      </Route> */}
        <CustomersCard />
      </CustomersUIProvider>
    </>
  );
}
