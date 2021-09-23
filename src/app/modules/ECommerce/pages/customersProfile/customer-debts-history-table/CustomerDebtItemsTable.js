// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import * as actions from '../../../_redux/sales/salesActions';
// import * as uiHelpers from '../ProductsUIHelpers';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls';
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from '../../../../../../_metronic/_helpers';
import * as columnFormatters from './column-formatters';
import { Pagination } from '../../../../../../_metronic/_partials/controls';
// import { useSalesUIContext } from '../ProductsUIContext';

export function CustomerDebtItems() {
  const { debtId } = useParams();
  console.log('DebtId', debtId);

  // Getting curret state of sales list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.sales }),
    shallowEqual
  );
  const { totalCount, entities, listLoading, saleForEdit } = currentState;
  const history = useHistory();

  const backToCustomerProfilePage = () => {
    history.goBack();
  };
  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchSale(debtId));
    // dispatch(actions.fetchSales(salesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debtId, dispatch]);

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
      <Modal
        size="lg"
        show={debtId ? true : false}
        onHide={backToCustomerProfilePage}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Card>
          <CardHeader title="Item list">
            <CardHeaderToolbar>
              <button
                type="button"
                onClick={backToCustomerProfilePage}
                className="btn btn-light"
              >
                <i className="fa fa-arrow-left"></i>
                Back
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
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
              <PleaseWaitMessage
                products={saleForEdit && saleForEdit.products}
              />
              <NoRecordsFoundMessage
                products={saleForEdit && saleForEdit.products}
              />
            </BootstrapTable>
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}
