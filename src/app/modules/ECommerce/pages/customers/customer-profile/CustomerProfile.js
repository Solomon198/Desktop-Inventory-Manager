import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { isEqual, isFunction } from 'lodash';
import * as actions from '../../../_redux/customers/customersActions';
import { CustomerProfileAccount } from './CustomerProfileAccount';
import { CustomerProfileHeader } from './CustomerProfileHeader';
import { CustomerSalesHistory } from './CustomerSalesHistory';
import { CustomerSalesHistory2 } from './CustomerSalesHistory2';

const CustomerUIContext = createContext();

export function useCustomerUIContext() {
  return useContext(CustomerUIContext);
}

export function CustomerProfile({
  history,
  match: {
    params: { id },
  },
}) {
  const initialFilter = {
    filter: {
      product_name: '',
    },
    customerId: id,
    transaction_type: '1',
    sortOrder: 'asc', // asc||desc
    sortField: 'id',
    pageNumber: 1,
    pageSize: 5,
  };
  const [queryParams, setQueryParamsBase] = useState(initialFilter);

  const { actionsLoading, customerForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.customers.actionsLoading,
      customerForEdit: state.customers.customerForEdit,
    }),
    shallowEqual
  );

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

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchCustomer(id));
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
            />
          </div>
          <div className="col-md-8">
            <CustomerSalesHistory2 />
          </div>
        </div>
      </CustomerUIContext.Provider>
    </>
  );
}
