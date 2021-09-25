import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext
} from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { isEqual, isFunction } from "lodash";
import * as actions from "../../../_redux/customers/customersActions";
import * as transactionActions from "../../../_redux/debtsManager/debtsManagerActions";
import { CustomerProfileAccount } from "./CustomerProfileAccount";
import { CustomerProfileHeader } from "./CustomerProfileHeader";
import { CustomerSalesHistory } from "./CustomerSalesHistory";
import { CustomerSalesHistory2 } from "./CustomerSalesHistory2";
import { CustomerDebtsHistory } from "./CustomerDebtsHistory";

const CustomerUIContext = createContext();

export function useCustomerUIContext() {
  return useContext(CustomerUIContext);
}

export function CustomerProfile({
  history,
  match: {
    params: { id }
  }
}) {
  const initialFilter = {
    filter: {
      product_name: ""
    },
    customerId: id,
    // transaction_type: "1",
    sortOrder: "asc", // asc||desc
    sortField: "id",
    pageNumber: 1,
    pageSize: 5
  };
  const [queryParams, setQueryParamsBase] = useState(initialFilter);

  const { actionsLoading, customerForEdit, debtForEdit } = useSelector(
    state => ({
      actionsLoading: state.customers.actionsLoading,
      customerForEdit: state.customers.customerForEdit,
      debtForEdit: state.debtsManager.debtForEdit
    }),
    shallowEqual
  );

  console.log("__Debt", debtForEdit);

  const setQueryParams = useCallback(nextQueryParams => {
    setQueryParamsBase(prevQueryParams => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchCustomer(id));
    dispatch(transactionActions.fetchCustomerTransaction(id));
  }, [id, dispatch]);

  return (
    <>
      <CustomerUIContext.Provider value={value}>
        <CustomerProfileHeader history={history} customer={customerForEdit} />
        <div className="row">
          <div className="col-md-4">
            <CustomerProfileAccount
              actionsLoading={actionsLoading}
              customer={customerForEdit && customerForEdit}
              customerTransactions={debtForEdit && debtForEdit}
            />
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-12">
                <CustomerSalesHistory2 />
              </div>
              <div className="col-md-12">
                <CustomerDebtsHistory />
              </div>
            </div>
          </div>
        </div>
      </CustomerUIContext.Provider>
    </>
  );
}
