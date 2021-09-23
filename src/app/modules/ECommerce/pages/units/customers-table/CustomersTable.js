// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import {
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

export function CustomersTable({ entities, totalCount, listLoading }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      setIds: customersUIContext.setIds,
      initStock: customersUIContext.initStock,
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      openEditCustomerDialog: customersUIContext.openEditCustomerDialog
    };
  }, [customersUIContext]);

  // Table columns
  const columns = [
    {
      dataField: "name",
      text: "Unit",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "bulk_size",
      text: "Bulk Size",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "price",
      text: "Price",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditCustomerDialog: customersUIProps.openEditCustomerDialog
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px"
      }
    }
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
                data={entities || []}
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
    </>
  );
}
