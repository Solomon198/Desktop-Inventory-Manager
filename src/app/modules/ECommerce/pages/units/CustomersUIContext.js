import React, { createContext, useContext, useState, useCallback } from 'react';
import { isEqual, isFunction } from 'lodash';
import { initialFilter } from './CustomersUIHelpers';

const CustomersUIContext = createContext();

export function useCustomersUIContext() {
  return useContext(CustomersUIContext);
}

export const CustomersUIConsumer = CustomersUIContext.Consumer;

export function CustomersUIProvider({ customersUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const [tab, setTab] = useState('basic');
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const initUnit = {
    _id: '',
    product_id: '',
    name: '',
    bulk_size: '0',
    price: '0',
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    tab,
    setTab,
    setQueryParams,
    initUnit,
    newCustomerButtonClick: customersUIEvents.newCustomerButtonClick,
    openEditCustomerDialog: customersUIEvents.openEditCustomerDialog,
    openDeleteCustomerDialog: customersUIEvents.openDeleteCustomerDialog,
    openDeleteCustomersDialog: customersUIEvents.openDeleteCustomersDialog,
    openFetchCustomersDialog: customersUIEvents.openFetchCustomersDialog,
    openUpdateCustomersStatusDialog:
      customersUIEvents.openUpdateCustomersStatusDialog,
    convertUnitButtonClick: customersUIEvents.convertUnitButtonClick,
  };

  return (
    <CustomersUIContext.Provider value={value}>
      {children}
    </CustomersUIContext.Provider>
  );
}
