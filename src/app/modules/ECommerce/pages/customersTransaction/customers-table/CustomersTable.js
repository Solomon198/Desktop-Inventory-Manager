// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import { useLocation } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/customers/customersActions';
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from '../../../../../../_metronic/_helpers';
import * as uiHelpers from '../CustomersUIHelpers';
import * as columnFormatters from './column-formatters';
import { Pagination } from '../../../../../../_metronic/_partials/controls';
import { useCustomersUIContext } from '../CustomersUIContext';

export function CustomersTable() {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      setIds: customersUIContext.setIds,
      setProduct: customersUIContext.setProduct,
      productsSelected: customersUIContext.productsSelected,
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      openEditCustomerDialog: customersUIContext.openEditCustomerDialog,
      openDeleteCustomerDialog: customersUIContext.openDeleteCustomerDialog,
    };
  }, [customersUIContext]);

  // Getting curret state of customers list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.customers }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;

  // Customers Redux state
  const dispatch = useDispatch();
  //customer history state
  const { state } = useLocation();
  useEffect(() => {
    // clear selections list
    customersUIProps.setIds([]);

    try {
      console.log(state.id);
    } catch (e) {}
    // server call by queryParams
    dispatch(actions.fetchCustomers(customersUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customersUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: 'product',
      text: 'Product',
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: 'quantity',
      text: 'Quantity',
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: 'unit',
      text: 'Unit',
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: 'amount',
      text: 'Amount',
      sort: true,
      sortCaret: sortCaret,
    },
    // {
    //   dataField: "status",
    //   text: "Status",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.StatusColumnFormatter,
    //   headerSortingClasses
    // },
    {
      dataField: 'totalAmount',
      text: 'TotalAmount',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'action',
      text: 'Actions',
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        setProduct: customersUIProps.setProduct,
        productsSelected: customersUIProps.productsSelected,
        openEditCustomerDialog: customersUIProps.openEditCustomerDialog,
        openDeleteCustomerDialog: customersUIProps.openDeleteCustomerDialog,
      },
      classes: 'text-right pr-0',
      headerClasses: 'text-right pr-3',
      style: {
        minWidth: '100px',
      },
    },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: customersUIProps.queryParams.pageSize,
    page: customersUIProps.queryParams.pageNumber,
  };

  // console.log(customersUIProps.productsSelected);

  return (
    <>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                remote
                keyField="productId"
                data={customersUIProps.productsSelected}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  customersUIProps.setQueryParams
                )}
                // selectRow={getSelectRow({
                //   entities,
                //   ids: customersUIProps.ids,
                //   setIds: customersUIProps.setIds
                // })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage
                  entities={customersUIProps.productsSelected}
                />
                <NoRecordsFoundMessage
                  entities={customersUIProps.productsSelected}
                />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
