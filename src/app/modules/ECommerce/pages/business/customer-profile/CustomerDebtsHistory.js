/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import { Card } from "../../../../../../_metronic/_partials/controls";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import * as uiHelpers from "./CustomerUIHelpers";
import { useCustomerUIContext } from "./CustomerProfile";
import * as actions from "../../../_redux/sales/salesActions";
import { getHandlerTableChangeForCustomer } from "../../../../../../_metronic/_helpers";

export function CustomerDebtsHistory() {
  const customerUIContext = useCustomerUIContext();
  const customerUIProps = useMemo(
    () => ({
      queryParams: customerUIContext.queryParams,
      setQueryParams: customerUIContext.setQueryParams
    }),
    [customerUIContext]
  );

  const { currentState } = useSelector(
    state => ({
      currentState: state.sales
    }),
    shallowEqual
  );

  const { debtEntities, totalDebtCount } = currentState;

  console.log("__Debt History", debtEntities);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchDebtsHistoryForCustomer(customerUIProps.queryParams));
  }, [customerUIProps.queryParams, dispatch]);

  const columns = [
    {
      dataField: "total_amount",
      text: "Total Amount"
    },
    {
      dataField: "part_payment",
      text: "Part Payment"
    },
    {
      dataField: "outstanding",
      text: "Outstanding"
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
    //     // openEditCustomerDialog: customersUIProps.openEditCustomerDialog,
    //     // openDeleteCustomerDialog: customersUIProps.openDeleteCustomerDialog,
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
    totalSize: totalDebtCount,
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
              Debts History
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
                    keyField="_id"
                    data={debtEntities === null ? [] : debtEntities}
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
