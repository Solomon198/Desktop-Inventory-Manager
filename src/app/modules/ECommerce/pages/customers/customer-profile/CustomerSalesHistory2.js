/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import { Card } from "../../../../../../_metronic/_partials/controls";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import * as uiHelpers from "./CustomerUIHelpers";
import { useCustomerUIContext } from "./CustomerProfile";
import { getHandlerTableChangeForCustomer } from "../../../../../../_metronic/_helpers";

export function CustomerSalesHistory2() {
  const customerUIContext = useCustomerUIContext();
  const customerUIProps = useMemo(
    () => ({
      queryParams: customerUIContext.queryParams,
      setQueryParams: customerUIContext.setQueryParams,
      lang: customerUIContext.lang
    }),
    [customerUIContext]
  );

  const sales = [
    {
      id: 1,
      product_name: "Golden Morn",
      quantity: "18",
      total_amount: "₦8,009.00",
      date: "18th Aug, 2021"
    },
    {
      id: 2,
      product_name: "Corn Flakes",
      quantity: "18",
      total_amount: "₦8,009.00",
      date: "18th Aug, 2021"
    },
    {
      id: 3,
      product_name: "Cocoa Pops",
      quantity: "18",
      total_amount: "₦8,009.00",
      date: "18th Aug, 2021"
    },
    {
      id: 4,
      product_name: "Youghurt",
      quantity: "18",
      total_amount: "₦8,009.00",
      date: "18th Aug, 2021"
    },
    {
      id: 5,
      product_name: "Cream Salad",
      quantity: "18",
      total_amount: "₦8,009.00",
      date: "18th Aug, 2021"
    }
  ];
  const columns = [
    {
      dataField: "product_name",
      text: "Product"
    },
    {
      dataField: "quantity",
      text: "Quantity"
    },
    {
      dataField: "total_amount",
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

  // Table Pagination Properties
  const paginationOptions = {
    custom: true,
    totalSize: sales.length,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: uiHelpers.initialFilter.pageSize,
    page: uiHelpers.initialFilter.pageNumber
  };

  return (
    <>
      <Card>
        {/* begin::Header */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Sales History
            </span>
          </h3>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body pt-0">
          <PaginationProvider pagination={paginationFactory(paginationOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <>
                <Pagination paginationProps={paginationProps}>
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    bordered={false}
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    bootstrap4
                    remote
                    keyField="id"
                    data={sales}
                    columns={columns}
                    onTableChange={getHandlerTableChangeForCustomer(
                      customerUIProps.setQueryParams
                    )}
                    {...paginationTableProps}
                  />
                </Pagination>
              </>
            )}
          </PaginationProvider>
        </div>
        {/* end::Body */}
      </Card>
      {/* end::Advance Table Widget 9 */}
    </>
  );
}
