import React from 'react';
import { Route } from 'react-router-dom';
import { CustomersLoadingDialog } from './customers-loading-dialog/CustomersLoadingDialog';
import { CustomerEditDialog } from './customer-edit-dialog/CustomerEditDialog';
import { CustomerDeleteDialog } from './customer-delete-dialog/CustomerDeleteDialog';
import { CustomersDeleteDialog } from './customers-delete-dialog/CustomersDeleteDialog';
import { CustomersFetchDialog } from './customers-fetch-dialog/CustomersFetchDialog';
import { CustomersUpdateStateDialog } from './customers-update-status-dialog/CustomersUpdateStateDialog';
import { CustomersUIProvider } from './CustomersUIContext';
import { CustomersCard } from './CustomersCard';
import { useHistory } from 'react-router-dom';

export function CustomerSalesPage({ history }) {
  const _history = useHistory();

  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push('/e-commerce/customer-sales/new');
    },

    proceedToQuickSale: (id) => {
      _history.push(`/e-commerce/customers-transaction`);
      // history.push(`/dashboard`);
    },

    proceedToTransaction: (id) => {
      _history.push(`/e-commerce/customers-transaction`, { id: id });
      // history.push(`/dashboard`);
    },

    openEditCustomerDialog: (id) => {
      history.push(`/e-commerce/customer-sales/${id}/edit`);
    },
    openDeleteCustomerDialog: (id) => {
      history.push(`/e-commerce/customer-sales/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/customer-sales/deleteCustomers`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/customer-sales/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push('/e-commerce/customer-sales/updateStatus');
    },
  };

  return (
    <CustomersUIProvider customersUIEvents={customersUIEvents}>
      <CustomersLoadingDialog />
      <Route path="/e-commerce/customer-sales/new">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customer-sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customer-sales/:id/edit">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push('/e-commerce/customer-sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customer-sales/deleteCustomers">
        {({ history, match }) => (
          <CustomersDeleteDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customer-sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customer-sales/:id/delete">
        {({ history, match }) => (
          <CustomerDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push('/e-commerce/customer-sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customer-sales/fetch">
        {({ history, match }) => (
          <CustomersFetchDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customer-sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customer-sales/updateStatus">
        {({ history, match }) => (
          <CustomersUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customer-sales');
            }}
          />
        )}
      </Route>
      <CustomersCard />
    </CustomersUIProvider>
  );
}
