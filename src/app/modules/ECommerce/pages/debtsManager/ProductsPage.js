import React from 'react';
import { Route } from 'react-router-dom';
import { ProductsLoadingDialog } from './products-loading-dialog/ProductsLoadingDialog';
import { ProductDeleteDialog } from './product-delete-dialog/ProductDeleteDialog';
import { ProductsDeleteDialog } from './products-delete-dialog/ProductsDeleteDialog';
import { ProductsFetchDialog } from './products-fetch-dialog/ProductsFetchDialog';
import { ProductsUpdateStatusDialog } from './products-update-status-dialog/ProductsUpdateStatusDialog';
import { ProductsCard } from './ProductsCard';
import { SalesUIProvider } from './ProductsUIContext';

export function DebtsManagerPage({ history }) {
  const salesUIEvents = {
    newSaleButtonClick: () => {
      // history.push('/e-commerce/sales/new');
      history.push('/e-commerce/customer-debts-manager');

      // alert('Hello');
    },
    openEditSalePage: (id) => {
      history.push(`/e-commerce/debts-manager/${id}/edit`);
    },
    openDeleteSaleDialog: (id) => {
      history.push(`/e-commerce/debts-manager/${id}/delete`);
    },
    openDeleteSalesDialog: () => {
      history.push(`/e-commerce/debts-manager/deleteSales`);
    },
    openFetchSalesDialog: () => {
      history.push(`/e-commerce/debts-manager/fetch`);
    },
    openUpdateSalesStatusDialog: () => {
      history.push('/e-commerce/debts-manager/updateStatus');
    },
    viewCustomerProfileButtonClick: (id) => {
      history.push(`/e-commerce/customer-profile/${id}/view`);
    },
  };

  return (
    <SalesUIProvider salesUIEvents={salesUIEvents}>
      <ProductsLoadingDialog />
      <Route path="/e-commerce/debts-manager/deleteSales">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/debts-manager');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/debts-manager/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push('/e-commerce/debts-manager');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/debts-manager/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/debts-manager');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/debts-manager/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/debts-manager');
            }}
          />
        )}
      </Route>
      <ProductsCard />
    </SalesUIProvider>
  );
}
