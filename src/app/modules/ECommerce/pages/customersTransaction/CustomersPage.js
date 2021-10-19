import React from 'react';
import { Route } from 'react-router-dom';
import { CustomersLoadingDialog } from './customers-loading-dialog/CustomersLoadingDialog';
import { CustomerEditDialog } from './customer-edit-dialog/CustomerEditDialog';
import { CustomerDeleteDialog } from './customer-delete-dialog/CustomerDeleteDialog';
import { CustomersDeleteDialog } from './customers-delete-dialog/CustomersDeleteDialog';
import { CustomersFetchDialog } from './customers-fetch-dialog/CustomersFetchDialog';
import { CustomersUpdateStateDialog } from './customers-update-status-dialog/CustomersUpdateStateDialog';
import { UnitConversionForm } from '../units/unit-conversion/UnitConversionForm';
import { CustomersUIProvider } from './CustomersUIContext';
import { CustomersCard } from './CustomersCard';
import { CustomerTransactionPreviewDialog } from './customer-transaction-preview-page/CustomerTransactionPreviewDialog';

export function CustomersTransactionPage({ history }) {
  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push('/e-commerce/customers-transaction/new');
    },
    openEditCustomerDialog: (id) => {
      history.push(`/e-commerce/customers-transaction/${id}/edit`);
    },
    openDeleteCustomerDialog: (id) => {
      history.push(`/e-commerce/customers-transaction/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/customers-transaction/deleteCustomers`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/customers-transaction/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push('/e-commerce/customers-transaction/updateStatus');
    },
  };

  return (
    <CustomersUIProvider customersUIEvents={customersUIEvents}>
      <CustomersLoadingDialog />
      <Route path="/e-commerce/customers-transaction/new">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customers-transaction');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customers-transaction/:id/edit">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push('/e-commerce/customers-transaction');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customers-transaction/:id/preview">
        {({ history, match }) => (
          <CustomerTransactionPreviewDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.goBack()}
          />
        )}
      </Route>
      <Route path="/e-commerce/customers-transaction/:id/unit-conversion">
        {({ history, match }) => (
          <UnitConversionForm
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push('/e-commerce/customers-transaction');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customers-transaction/deleteCustomers">
        {({ history, match }) => (
          <CustomersDeleteDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customers-transaction');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customers-transaction/:id/delete">
        {({ history, match }) => (
          <CustomerDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push('/e-commerce/customers-transaction');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customers-transaction/fetch">
        {({ history, match }) => (
          <CustomersFetchDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customers-transaction');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/customers-transaction/updateStatus">
        {({ history, match }) => (
          <CustomersUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/customers-transaction');
            }}
          />
        )}
      </Route>
      <CustomersCard />
    </CustomersUIProvider>
  );
}
