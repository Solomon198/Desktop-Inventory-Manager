import React, { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { CustomersPage } from './customers/CustomersPage';
import { CustomerSalesPage } from './customerSales/CustomersPage';
import { CustomersTransactionPage } from './customersTransaction/CustomersPage';
import { EmployeesPage } from './employees/CustomersPage';
import { ProductsPage } from './products/ProductsPage';
import { StocksPage } from './stocks/ProductsPage';
import { SalesPage } from './sales/ProductsPage';
import { ExpensesPage } from './expenses/ProductsPage';
import { DebtsManagerPage } from './debtsManager/ProductsPage';
import { ProductEdit } from './products/product-edit/ProductEdit';
import { StockEdit } from './stocks/product-edit/ProductEdit';
import { SalesEdit } from './sales/product-edit/ProductEdit';
import { ExpenseEdit } from './expenses/product-edit/ProductEdit';
import { DebtsManagerEdit } from './debtsManager/product-edit/ProductEdit';
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
        <ContentRoute
          path="/e-commerce/customers-transaction"
          component={CustomersTransactionPage}
        />
        <ContentRoute path="/e-commerce/products/new" component={ProductEdit} />
        <ContentRoute path="/e-commerce/sales/new" component={SalesEdit} />
        <ContentRoute path="/e-commerce/stocks/new" component={StockEdit} />
        <ContentRoute path="/e-commerce/expenses/new" component={ExpenseEdit} />
        <ContentRoute
          path="/e-commerce/debts-manager/new"
          component={DebtsManagerEdit}
        />

        <ContentRoute
          path="/e-commerce/products/:id/edit"
          component={ProductEdit}
        />
        <ContentRoute path="/e-commerce/sales/:id/edit" component={SalesEdit} />
        <ContentRoute
          path="/e-commerce/expenses/:id/edit"
          component={ExpenseEdit}
        />
        <ContentRoute
          path="/e-commerce/debts-manager/:id/edit"
          component={DebtsManagerEdit}
        />

        <ContentRoute path="/e-commerce/products" component={ProductsPage} />
        <ContentRoute path="/e-commerce/stocks" component={StocksPage} />
        <ContentRoute path="/e-commerce/employees" component={EmployeesPage} />
        <ContentRoute path="/e-commerce/sales" component={SalesPage} />
        <ContentRoute path="/e-commerce/expenses" component={ExpensesPage} />
        <ContentRoute
          path="/e-commerce/debts-manager"
          component={DebtsManagerPage}
        />
      </Switch>
    </Suspense>
  );
}
