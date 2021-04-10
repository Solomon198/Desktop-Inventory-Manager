import React from "react";
import { Route } from "react-router-dom";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ProductDeleteDialog } from "./product-delete-dialog/ProductDeleteDialog";
import { ProductsDeleteDialog } from "./products-delete-dialog/ProductsDeleteDialog";
import { ProductsFetchDialog } from "./products-fetch-dialog/ProductsFetchDialog";
import { ProductsUpdateStatusDialog } from "./products-update-status-dialog/ProductsUpdateStatusDialog";
import { ProductsCard } from "./ProductsCard";
import { ProductsUIProvider } from "./ProductsUIContext";

export function ExpensesPage({ history }) {
  const productsUIEvents = {
    newProductButtonClick: () => {
      history.push("/e-commerce/expenses/new");
    },
    openEditProductPage: id => {
      history.push(`/e-commerce/expenses/${id}/edit`);
    },
    openDeleteProductDialog: id => {
      history.push(`/e-commerce/expenses/${id}/delete`);
    },
    openDeleteProductsDialog: () => {
      history.push(`/e-commerce/expenses/deleteProducts`);
    },
    openFetchProductsDialog: () => {
      history.push(`/e-commerce/expenses/fetch`);
    },
    openUpdateProductsStatusDialog: () => {
      history.push("/e-commerce/expenses/updateStatus");
    }
  };

  return (
    <ProductsUIProvider productsUIEvents={productsUIEvents}>
      <ProductsLoadingDialog />
      <Route path="/e-commerce/expenses/deleteProducts">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/expenses/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
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
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/expenses/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/expenses");
            }}
          />
        )}
      </Route>
      <ProductsCard />
    </ProductsUIProvider>
  );
}
