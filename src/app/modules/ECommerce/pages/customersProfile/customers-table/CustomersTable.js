// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import { Card } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/sales/salesActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../CustomersUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useCustomersUIContext } from "../CustomersUIContext";

export function CustomersTable({ customerId }) {
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
      viewCustomerProfileButtonClick:
        customersUIContext.viewCustomerProfileButtonClick
    };
  }, [customersUIContext]);

  // Getting curret state of customers list from store (Redux)
  const { currentState } = useSelector(
    state => ({
      currentState: state.sales
    }),
    shallowEqual
  );

  const { listLoading, entities, totalCount } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    // clear selections list
    // customersUIProps.setIds([]);
    dispatch(
      actions.fetchSalesHistoryForCustomer(
        customersUIProps.queryParams,
        customerId
      )
    );
  }, [customersUIProps.queryParams, dispatch, customerId]);

  // Table columns
  const columns = [
    {
      dataField: "product",
      text: "Product"
    },
    {
      dataField: "quantity",
      text: "Quantity"
    },
    {
      dataField: "unit",
      text: "Unit"
    },
    {
      dataField: "totalAmount",
      text: "Total Amount"
    },
    {
      dataField: "date",
      text: "Date"
    }
    // {
    //   dataField: 'action',
    //   text: 'Actions',
    //   formatter: columnFormatters.ActionsColumnFormatter,
    //   formatExtraData: {
    //     openEditCustomerDialog: customersUIProps.openEditCustomerDialog,
    //     openDeleteCustomerDialog: customersUIProps.openDeleteCustomerDialog,
    //     viewCustomerProfileButtonClick:
    //       customersUIProps.viewCustomerProfileButtonClick,
    //   },
    //   classes: 'text-right pr-0',
    //   headerClasses: 'text-right pr-3',
    //   style: {
    //     minWidth: '100px',
    //   },
    // },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: customersUIProps.queryParams.pageSize,
    page: customersUIProps.queryParams.pageNumber
  };

  return (
    <>
      <Card>
        {/* begin::Header */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Sales Completed History
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
                  data={entities === null ? [] : entities}
                  columns={columns}
                  defaultSorted={uiHelpers.defaultSorted}
                  onTableChange={getHandlerTableChange(
                    customersUIProps.setQueryParams
                  )}
                  // selectRow={getSelectRow({
                  //   entities,
                  //   ids: customersUIProps.ids,
                  //   setIds: customersUIProps.setIds,
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
      </Card>
    </>
  );
}
