// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/sales/salesActions";
import * as uiHelpers from "../ProductsUIHelpers";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useSalesUIContext } from "../ProductsUIContext";

export function CustomerInvoice() {
  // Products UI Context
  // const salesUIContext = useSalesUIContext();
  // const salesUIProps = useMemo(() => {
  //   return {
  //     ids: salesUIContext.ids,
  //     setIds: salesUIContext.setIds,
  //     queryParams: salesUIContext.queryParams,
  //     setQueryParams: salesUIContext.setQueryParams,
  //     openEditSalePage: salesUIContext.openEditSalePage,
  //     openDeleteSaleDialog: salesUIContext.openDeleteSaleDialog,
  //   };
  // }, [salesUIContext]);

  // Getting curret state of sales list from store (Redux)
  // const { currentState } = useSelector(
  //   (state) => ({ currentState: state.sales }),
  //   shallowEqual
  // );
  // const { totalCount, entities, listLoading } = currentState;
  // console.log(entities);
  // Products Redux state
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   // clear selections list
  //   salesUIProps.setIds([]);
  //   // server call by queryParams
  //   dispatch(actions.fetchSales(salesUIProps.queryParams));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [salesUIProps.queryParams, dispatch]);

  // Custom Product
  const products = [
    {
      _id: 1,
      product: "MacBook",
      quantity: 2,
      unit: "pieces",
      amount: 78968,
      date: "23-04-2021"
    },
    {
      _id: 2,
      product: "HP ProBook",
      quantity: 2,
      unit: "pieces",
      amount: 78968,
      date: "23-04-2021"
    },
    {
      _id: 3,
      product: "Dell Corei5",
      quantity: 2,
      unit: "pieces",
      amount: 78968,
      date: "23-04-2021"
    }
  ];

  // Table columns
  const columns = [
    {
      dataField: "product",
      text: "Product",
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: "quantity",
      text: "Quantity",
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: "unit",
      text: "Unit",
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: "amount",
      text: "Amount",
      sort: true,
      sortCaret: sortCaret
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      sortCaret: sortCaret
    }
  ];
  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        remote
        keyField="_id"
        data={products === null ? [] : products}
        columns={columns}
      >
        <PleaseWaitMessage products={products} />
        <NoRecordsFoundMessage products={products} />
      </BootstrapTable>
    </>
  );
}
