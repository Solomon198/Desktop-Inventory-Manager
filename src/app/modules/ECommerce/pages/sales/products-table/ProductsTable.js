// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/sales/salesActions';
import * as uiHelpers from '../ProductsUIHelpers';
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from '../../../../../../_metronic/_helpers';
import * as columnFormatters from './column-formatters';
import { Pagination } from '../../../../../../_metronic/_partials/controls';
import { useSalesUIContext } from '../ProductsUIContext';

export function ProductsTable() {
  // Products UI Context
  const salesUIContext = useSalesUIContext();
  const salesUIProps = useMemo(() => {
    return {
      ids: salesUIContext.ids,
      setIds: salesUIContext.setIds,
      customerInvoice: salesUIContext.customerInvoice,
      setCustomerInvoice: salesUIContext.setCustomerInvoice,
      queryParams: salesUIContext.queryParams,
      setQueryParams: salesUIContext.setQueryParams,
      openSaleInvoice: salesUIContext.openSaleInvoice,
      openDeleteSaleDialog: salesUIContext.openDeleteSaleDialog,
    };
  }, [salesUIContext]);

  // Getting curret state of sales list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.sales }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;

  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    salesUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchSales(salesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: 'customer_name',
      text: 'Customer',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'customer_phone',
      text: 'Phone Number',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'total_amount',
      text: 'Total Amount',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'date',
      text: 'Date',
      sort: true,
      sortCaret: sortCaret,
    },
    // {
    //   dataField: "status",
    //   text: "Status",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.StatusColumnFormatter
    // },
    {
      dataField: 'action',
      text: 'Actions',
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openSaleInvoice: salesUIProps.openSaleInvoice,
        openDeleteSaleDialog: salesUIProps.openDeleteSaleDialog,
        customerInvoice: salesUIProps.customerInvoice,
        setCustomerInvoice: salesUIProps.setCustomerInvoice,
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
    sizePerPage: salesUIProps.queryParams.pageSize,
    page: salesUIProps.queryParams.pageNumber,
  };
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
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                remote
                keyField="_id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  salesUIProps.setQueryParams
                )}
                // selectRow={getSelectRow({
                //   entities,
                //   ids: salesUIProps.ids,
                //   setIds: salesUIProps.setIds,
                // })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
