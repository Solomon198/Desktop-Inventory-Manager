import React, { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { CustomersPage } from './customers/CustomersPage';
import { CustomerSalesPage } from './customerSales/CustomersPage';
import { EmployeesPage } from './employees/CustomersPage';
import { ProductsPage } from './products/ProductsPage';
import { SalesPage } from './sales/ProductsPage';
import { ProductEdit } from './products/product-edit/ProductEdit';
import { SalesEdit } from './sales/product-edit/ProductEdit';
import { LayoutSplashScreen, ContentRoute } from '../../../../_metronic/layout';

export default function eCommercePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from eCommerce root URL to /customers */
          <Redirect
            exact={true}
            from="/e-commerce"
            to="/e-commerce/customers"
          />
        }
        <ContentRoute path="/e-commerce/customers" component={CustomersPage} />
        <ContentRoute
          path="/e-commerce/customer-sales"
          component={CustomerSalesPage}
        />
        <ContentRoute path="/e-commerce/products/new" component={ProductEdit} />
        <ContentRoute path="/e-commerce/sales/new" component={SalesEdit} />

        <ContentRoute
          path="/e-commerce/products/:id/edit"
          component={ProductEdit}
        />

        <ContentRoute path="/e-commerce/products" component={ProductsPage} />
        <ContentRoute path="/e-commerce/employees" component={EmployeesPage} />
        <ContentRoute path="/e-commerce/sales" component={SalesPage} />
      </Switch>
    </Suspense>
  );
}
