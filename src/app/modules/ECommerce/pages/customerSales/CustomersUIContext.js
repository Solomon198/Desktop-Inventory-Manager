import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./CustomersUIHelpers";

const CustomersUIContext = createContext();

export function useCustomersUIContext() {
  return useContext(CustomersUIContext);
}

export const CustomersUIConsumer = CustomersUIContext.Consumer;

export function CustomersUIProvider({ customersUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const [id, setId] = useState();
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

  const initCustomer = {
    _id: "",
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone_no: "",
    address: ""
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    id,
    setId,
    setIds,
    setQueryParams,
    initCustomer,
    newCustomerButtonClick: customersUIEvents.newCustomerButtonClick,
    proceedToTransaction: customersUIEvents.proceedToTransaction,
    proceedToQuickSale: customersUIEvents.proceedToQuickSale,
    openEditCustomerDialog: customersUIEvents.openEditCustomerDialog,
    openDeleteCustomerDialog: customersUIEvents.openDeleteCustomerDialog,
    openDeleteCustomersDialog: customersUIEvents.openDeleteCustomersDialog,
    openFetchCustomersDialog: customersUIEvents.openFetchCustomersDialog,
    openUpdateCustomersStatusDialog:
      customersUIEvents.openUpdateCustomersStatusDialog
  };

  return (
    <CustomersUIContext.Provider value={value}>
      {children}
    </CustomersUIContext.Provider>
  );
}
