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
import { Card } from '../../../../../../_metronic/_partials/controls';
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

export function CustomerDebtHistoryItems({ customerId }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      setIds: customersUIContext.setIds,
      showSnackbar: customersUIContext.showSnackbar,
      setShowSnackbar: customersUIContext.setShowSnackbar,
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      openEditCustomerDialog: customersUIContext.openEditCustomerDialog,
      openDeleteCustomerDialog: customersUIContext.openDeleteCustomerDialog,
      viewCustomerDebtItems: customersUIContext.viewCustomerDebtItems,
    };
  }, [customersUIContext]);

  // Getting curret state of customers list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({
      currentState: state.sales,
    }),
    shallowEqual
  );

  const { listLoading, debtEntities, totalDebtCount } = currentState;
  console.log('Debt Entities__', debtEntities);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.fetchDebtsHistoryForCustomer(
        customersUIProps.queryParams,
        customerId
      )
    );
  }, [customerId, customersUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: 'total_amount',
      text: 'Total Amount',
    },
    {
      dataField: 'part_payment',
      text: 'Part Payment',
    },
    {
      dataField: 'outstanding',
      text: 'Outstanding',
    },
    {
      dataField: 'date',
      text: 'Date',
    },
    {
      dataField: 'action',
      text: 'Actions',
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        // openEditCustomerDialog: customersUIProps.openEditCustomerDialog,
        // openDeleteCustomerDialog: customersUIProps.openDeleteCustomerDialog,
        viewCustomerDebtItems: customersUIProps.viewCustomerDebtItems,
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
    totalSize: totalDebtCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: customersUIProps.queryParams.pageSize,
    page: customersUIProps.queryParams.pageNumber,
  };

  return (
    <>
      <Card>
        {/* begin::Header */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Debts History
            </span>
          </h3>
        </div>
        {/* end::Header */}
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
                  keyField="_id"
                  data={debtEntities === null ? [] : debtEntities}
                  columns={columns}
                  defaultSorted={uiHelpers.defaultSorted}
                  onTableChange={getHandlerTableChange(
                    customersUIProps.setQueryParams
                  )}
                  // selectRow={getSelectRow({
                  //   debtEntities,
                  //   ids: customersUIProps.ids,
                  //   setIds: customersUIProps.setIds,
                  // })}
                  {...paginationTableProps}
                >
                  <PleaseWaitMessage entities={debtEntities} />
                  <NoRecordsFoundMessage entities={debtEntities} />
                </BootstrapTable>
              </Pagination>
            );
          }}
        </PaginationProvider>
      </Card>
    </>
  );
}
