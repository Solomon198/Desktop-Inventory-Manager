import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import * as auth from '../app/modules/Auth/_redux/authRedux';
import { customersSlice } from '../app/modules/ECommerce/_redux/customers/customersSlice';
import { employeesSlice } from '../app/modules/ECommerce/_redux/employees/employeesSlice';
import { productsSlice } from '../app/modules/ECommerce/_redux/products/productsSlice';
import { debtsManagerSlice } from '../app/modules/ECommerce/_redux/debtsManager/debtsManagerSlice';
import { salesSlice } from '../app/modules/ECommerce/_redux/sales/salesSlice';
import { unitsSlice } from '../app/modules/ECommerce/_redux/units/unitsSlice';
import { stocksSlice } from '../app/modules/ECommerce/_redux/stocks/stocksSlice';
import { stocksEntrySlice } from '../app/modules/ECommerce/_redux/stocksEntry/stocksEntrySlice';
import { suppliersSlice } from '../app/modules/ECommerce/_redux/suppliers/suppliersSlice';
import { rolesSlice } from '../app/modules/ECommerce/_redux/roles/rolesSlice';
import { expensesSlice } from '../app/modules/ECommerce/_redux/expenses/expensesSlice';
import { expensesItemSlice } from '../app/modules/ECommerce/_redux/expensesItem/expensesItemSlice';
import { remarksSlice } from '../app/modules/ECommerce/_redux/remarks/remarksSlice';
import { specificationsSlice } from '../app/modules/ECommerce/_redux/specifications/specificationsSlice';
import { snackbarSlice } from '../app/modules/ECommerce/_redux/snackbar/snackbarSlice';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  customers: customersSlice.reducer,
  employees: employeesSlice.reducer,
  debtsManager: debtsManagerSlice.reducer,
  products: productsSlice.reducer,
  sales: salesSlice.reducer,
  units: unitsSlice.reducer,
  suppliers: suppliersSlice.reducer,
  roles: rolesSlice.reducer,
  stocks: stocksSlice.reducer,
  stocksEntry: stocksEntrySlice.reducer,
  expenses: expensesSlice.reducer,
  expensesItem: expensesItemSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer,
  snackbar: snackbarSlice.reducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
