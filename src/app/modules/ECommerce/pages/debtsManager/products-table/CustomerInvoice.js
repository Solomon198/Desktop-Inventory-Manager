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
import DateRangeSharpIcon from '@material-ui/icons/DateRangeSharp';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import PhoneSharpIcon from '@material-ui/icons/PhoneSharp';
import MonetizationOnSharpIcon from '@material-ui/icons/MonetizationOnSharp';
import PaymentSharpIcon from '@material-ui/icons/PaymentSharp';
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

export function CustomerInvoice({ id }) {
  // Getting curret state of sales list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.sales }),
    shallowEqual
  );
  const { totalCount, entities, listLoading, saleForEdit } = currentState;
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
      dataField: 'product',
      text: 'Product',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'quantity',
      text: 'Quantity',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'unit',
      text: 'Unit',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'totalAmount',
      text: 'Amount',
      sort: true,
      sortCaret: sortCaret,
    },
  ];
  return (
    <>
      <div className="mb-5">
        {/* {saleForEdit && saleForEdit.outstanding !== "₦0.00" ? (
          <h1>OUTSTANDING MANAGER</h1>
        ) : (
          <h1>DEBT MANAGER</h1>
        )} */}
        <h1 className="text-center">Debt Manager</h1>
        <hr />
        <div className="d-flex justify-content-between">
          <div>
            <h4 className="mb-2">Customer Info</h4>
            <div className="d-flex my-5">
              <div className="navi-icon mr-2">
                {/* <i className="flaticon2-phone text-primary" /> */}
                <PersonOutlineSharpIcon style={{ color: '#1779a5' }} />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold cursor-pointer">Full Name</div>
                <div className="text-muted">
                  <span>{saleForEdit && saleForEdit.customer_name}</span>
                </div>
              </div>
            </div>
            <div className="d-flex my-5">
              <div className="navi-icon mr-2">
                {/* <i className="flaticon2-phone text-primary" /> */}
                <PhoneSharpIcon style={{ color: '#1779a5' }} />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold cursor-pointer">Full Name</div>
                <div className="text-muted">
                  <span>{saleForEdit && saleForEdit.customer_phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex my-5">
            <div className="navi-icon mr-2">
              {/* <i className="flaticon2-phone text-primary" /> */}
              <DateRangeSharpIcon style={{ color: '#1779a5' }} />
            </div>
            <div className="navi-text">
              <div className="font-weight-bold cursor-pointer">Date</div>
              <div className="text-muted">
                <span>{saleForEdit && saleForEdit.date}</span>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="d-flex justify-content-between">
          <div>
            {saleForEdit &&
            saleForEdit.outstanding !== '₦0.00' &&
            saleForEdit.part_payment !== '₦0.00' ? (
              <div>
                <h3>Outstanding</h3>
                <div className="d-flex my-5">
                  <div className="navi-icon mr-2">
                    {/* <i className="flaticon2-phone text-primary" /> */}
                    <MonetizationOnSharpIcon style={{ color: '#1779a5' }} />
                  </div>
                  <div className="navi-text">
                    <div className="font-weight-bold cursor-pointer">Paid</div>
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          color: '#1779a5',
                          fontWeight: 'bold',
                        }}
                      >
                        {saleForEdit && saleForEdit.part_payment}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex my-5">
                  <div className="navi-icon mr-2">
                    {/* <i className="flaticon2-phone text-primary" /> */}
                    <PaymentSharpIcon style={{ color: 'red' }} />
                  </div>
                  <div className="navi-text">
                    <div className="font-weight-bold cursor-pointer">
                      Outstanding
                    </div>
                    <div className="text-muted">
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}
                      >
                        {saleForEdit && saleForEdit.outstanding}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3>DEBT</h3>
                <strong>
                  <p style={{ color: 'red' }}>
                    {saleForEdit && saleForEdit.total_amount}
                  </p>
                </strong>
              </div>
            )}
          </div>

          <div>
            <div className="d-flex my-5">
              <div className="navi-icon mr-2">
                {/* <i className="flaticon2-phone text-primary" /> */}
                <MonetizationOnSharpIcon style={{ color: '#1779a5' }} />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold cursor-pointer">
                  Total Amount
                </div>
                <div className="text-muted">
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 'bolder',
                      color: '#1779a5',
                    }}
                  >
                    {saleForEdit && saleForEdit.total_amount}
                  </span>
                </div>
              </div>
            </div>
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
