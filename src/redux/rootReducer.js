import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import { customersSlice } from "../app/modules/ECommerce/_redux/customers/customersSlice";
import { employeesSlice } from "../app/modules/ECommerce/_redux/employees/employeesSlice";
import { productsSlice } from "../app/modules/ECommerce/_redux/products/productsSlice";
import { salesSlice } from "../app/modules/ECommerce/_redux/sales/salesSlice";
import { remarksSlice } from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
import { specificationsSlice } from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  customers: customersSlice.reducer,
  employees: employeesSlice.reducer,
  products: productsSlice.reducer,
  sales: salesSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
