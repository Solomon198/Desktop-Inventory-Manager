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
      dataField: "totalAmount",
      text: "Amount",
      sort: true,
      sortCaret: sortCaret
    }
  ];
  return (
    <>
      <div className="mb-5">
        {saleForEdit && saleForEdit.outstanding !== "₦0.00" ? (
          <h1>OUTSTANDING MANAGER</h1>
        ) : (
          <h1>DEBT MANAGER</h1>
        )}
        <hr />
        <div className="d-flex justify-content-between">
          <div className="date">
            <h3 className="mb-2">DATE</h3>
            <span>{saleForEdit && saleForEdit.date}</span>
          </div>
          {/* <div className="invoiceNo">
            <h3 className="mb-2">INVOICE NO</h3>
            <span className="text-center">
              {saleForEdit && saleForEdit._id}
            </span>
          </div> */}

          <div>
            <h3 className="mb-2">CUSTOMER INFO</h3>
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
          {/* <div className="companyInfo">
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
          </div> */}
        </div>
        <hr />

        <div className="d-flex justify-content-between">
          <div>
            {saleForEdit &&
            saleForEdit.outstanding !== "₦0.00" &&
            saleForEdit.part_payment !== "₦0.00" ? (
              <div>
                <h3>OUTSTANDING</h3>
                <p>
                  <strong>
                    PAID:{" "}
                    <span style={{ color: "red" }}>
                      {saleForEdit && saleForEdit.part_payment}
                    </span>
                  </strong>
                </p>
                <p>
                  <strong>
                    OUTSTANDING:{" "}
                    <span style={{ color: "red" }}>
                      {saleForEdit && saleForEdit.outstanding}
                    </span>
                  </strong>
                </p>
              </div>
            ) : (
              <div>
                <h3>DEBT</h3>
                <strong>
                  <p style={{ color: "red" }}>
                    {saleForEdit && saleForEdit.total_amount}
                  </p>
                </strong>
              </div>
            )}
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
        <PleaseWaitMessage products={products} />
        <NoRecordsFoundMessage products={products} />
      </BootstrapTable>
    </>
  );
}
