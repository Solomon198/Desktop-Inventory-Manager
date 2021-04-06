import React, { createContext, useContext, useState, useCallback } from 'react';
import { isEqual, isFunction } from 'lodash';
import { initialFilter } from './CustomersUIHelpers';

const EmployeesUIContext = createContext();

export function useEmployeesUIContext() {
  return useContext(EmployeesUIContext);
}

export const EmployeesUIConsumer = EmployeesUIContext.Consumer;

export function EmployeesUIProvider({ employeesUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
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

  const initEmployee = {
    _id: '',
    title: '',
    first_name: '',
    last_name: '',
    gender: '',
    login: '',
    email: '',
    phone_no: '',
    home_address: '',
    role: '',
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initEmployee,
    newEmployeeButtonClick: employeesUIEvents.newEmployeeButtonClick,
    openEditEmployeeDialog: employeesUIEvents.openEditEmployeeDialog,
    openDeleteEmployeeDialog: employeesUIEvents.openDeleteEmployeeDialog,
    openDeleteEmployeesDialog: employeesUIEvents.openDeleteEmployeesDialog,
    openFetchEmployeesDialog: employeesUIEvents.openFetchEmployeesDialog,
    openUpdateEmployeesStatusDialog:
      employeesUIEvents.openUpdateEmployeesStatusDialog,
  };

  return (
    <EmployeesUIContext.Provider value={value}>
      {children}
    </EmployeesUIContext.Provider>
  );
}
