import React from 'react';
import { Route } from 'react-router-dom';
import { ProductsLoadingDialog } from './products-loading-dialog/ProductsLoadingDialog';
import { ProductDeleteDialog } from './product-delete-dialog/ProductDeleteDialog';
import { ProductsDeleteDialog } from './products-delete-dialog/ProductsDeleteDialog';
import { ProductsFetchDialog } from './products-fetch-dialog/ProductsFetchDialog';
import { ProductsUpdateStatusDialog } from './products-update-status-dialog/ProductsUpdateStatusDialog';
import { ProductsCard } from './ProductsCard';
import { SalesUIProvider } from './ProductsUIContext';

export function SalesPage({ history }) {
  const salesUIEvents = {
    newSaleButtonClick: () => {
      // history.push('/e-commerce/sales/new');
      history.push('/e-commerce/customer-sales');

      // alert('Hello');
    },
    openEditSalePage: (id) => {
      history.push(`/e-commerce/sales/${id}/edit`);
    },
    openDeleteSaleDialog: (id) => {
      history.push(`/e-commerce/sales/${id}/delete`);
    },
    openDeleteSalesDialog: () => {
      history.push(`/e-commerce/sales/deleteSales`);
    },
    openFetchSalesDialog: () => {
      history.push(`/e-commerce/sales/fetch`);
    },
    openUpdateSalesStatusDialog: () => {
      history.push('/e-commerce/sales/updateStatus');
    },
  };

  return (
    <SalesUIProvider salesUIEvents={salesUIEvents}>
      <ProductsLoadingDialog />
      <Route path="/e-commerce/sales/deleteSales">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/sales/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push('/e-commerce/sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/sales/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/sales');
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/sales/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push('/e-commerce/sales');
            }}
          />
        )}
      </Route>
      <ProductsCard />
    </SalesUIProvider>
  );
}
