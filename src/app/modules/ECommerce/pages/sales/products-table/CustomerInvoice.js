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

export function CustomerInvoice({ id }) {
  // Getting curret state of sales list from store (Redux)
  const { currentState } = useSelector(
    state => ({ currentState: state.sales }),
    shallowEqual
  );
  const { totalCount, entities, listLoading, saleForEdit } = currentState;
  console.log(saleForEdit);
  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchSale(id));
    // dispatch(actions.fetchSales(salesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

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
      dataField: "totalAmount",
      text: "Amount",
      sort: true,
      sortCaret: sortCaret
    }
  ];
  return (
    <>
      <div className="mb-5">
        <h1 className="mb-2">INVOICE</h1>
        <hr />
        <div className="d-flex justify-content-between">
          <div className="date">
            <h3 className="mb-2">DATE</h3>
            <span>{saleForEdit && saleForEdit.date}</span>
          </div>
          <div className="invoiceNo">
            <h3 className="mb-2">INVOICE NO</h3>
            <span className="text-center">
              {saleForEdit && saleForEdit._id}
            </span>
          </div>
          <div className="companyInfo">
            <h3 className="mb-2">YOUR COMPANY</h3>
            <span>
              <strong>Dixre Enterprise</strong>
            </span>
            <br />
            <span>GF1 Nasara Plaza,</span>
            <br />
            <span>Kano road, by Ibadan street.</span>
            <br />
            <span>Kaduna, Kaduna state.</span>
          </div>
        </div>
        <hr />

        <div className="d-flex justify-content-between">
          <div>
            <h3 className="mb-2">INVOICE TO</h3>
            <span>
              Full Name:{"  "}
              <strong>{saleForEdit && saleForEdit.customer_name}</strong>
            </span>
            <br />
            <span>
              Phone no:{"  "}
              <strong>{saleForEdit && saleForEdit.customer_phone}</strong>
            </span>
          </div>

          <div>
            <h3>TOTAL AMOUNT</h3>
            <h2 style={{ color: "red" }}>
              {saleForEdit && saleForEdit.total_amount}
            </h2>
          </div>
        </div>
        <hr />
      </div>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        remote
        keyField="_id"
        data={!saleForEdit ? [] : saleForEdit.products}
        columns={columns}
      >
        <PleaseWaitMessage products={saleForEdit && saleForEdit.products} />
        <NoRecordsFoundMessage products={saleForEdit && saleForEdit.products} />
      </BootstrapTable>
    </>
  );
}
