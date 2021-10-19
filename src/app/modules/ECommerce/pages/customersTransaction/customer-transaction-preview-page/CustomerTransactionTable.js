// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from '../../../../../../_metronic/_helpers';
import helperFuncs from '../../utils/helper.funcs';
import { useCustomersUIContext } from '../CustomersUIContext';

export function CustomerTransactionTable() {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      setIds: customersUIContext.setIds,
      setProductsSelected: customersUIContext.setProductsSelected,
      productsSelected: customersUIContext.productsSelected,
      itemForEdit: customersUIContext.itemForEdit,
      setItemForEdit: customersUIContext.setItemForEdit,
      queryParams: customersUIContext.queryParams,
      setQueryParams: customersUIContext.setQueryParams,
      openEditCustomerDialog: customersUIContext.openEditCustomerDialog,
      openDeleteCustomerDialog: customersUIContext.openDeleteCustomerDialog,
    };
  }, [customersUIContext]);

  let productsSelectedEntries = [];
  let grossTotal;

  if (customersUIProps.productsSelected) {
    customersUIProps.productsSelected.forEach((obj) => {
      let _newObj = Object.assign({}, obj);
      // _newObj.amount = helperFuncs.transformToCurrencyString(_newObj.amount);
      // _newObj.totalAmount = helperFuncs.transformToCurrencyString(
      //   _newObj.totalAmount
      // );
      productsSelectedEntries.push(_newObj);
    });
  }

  if (grossTotal) {
    console.log('Gross Total: ', grossTotal);
  }

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
      dataField: 'amount',
      text: 'Amount',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'totalAmount',
      text: 'TotalAmount',
      sort: true,
      sortCaret: sortCaret,
    },
  ];

  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        remote
        keyField="unit_id"
        data={productsSelectedEntries || []}
        columns={columns}
      >
        <PleaseWaitMessage entities={productsSelectedEntries} />
        <NoRecordsFoundMessage entities={productsSelectedEntries} />
      </BootstrapTable>
    </>
  );
}
