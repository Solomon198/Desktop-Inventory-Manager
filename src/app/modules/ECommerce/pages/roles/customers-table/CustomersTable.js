// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/roles/rolesActions';
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from '../../../../../../_metronic/_helpers';
import * as uiHelpers from '../CustomersUIHelpers';
import * as columnFormatters from './column-formatters';
import { Pagination } from '../../../../../../_metronic/_partials/controls';
import { useCustomersUIContext } from '../CustomersUIContext';

export function CustomersTable() {
  // Roles UI Context
  const rolesUIContext = useCustomersUIContext();
  const rolesUIProps = useMemo(() => {
    return {
      ids: rolesUIContext.ids,
      setIds: rolesUIContext.setIds,
      showSnackbar: rolesUIContext.showSnackbar,
      setShowSnackbar: rolesUIContext.setShowSnackbar,
      queryParams: rolesUIContext.queryParams,
      setQueryParams: rolesUIContext.setQueryParams,
      openEditCustomerDialog: rolesUIContext.openEditCustomerDialog,
      openDeleteCustomerDialog: rolesUIContext.openDeleteCustomerDialog,
      viewCustomerProfileButtonClick:
        rolesUIContext.viewCustomerProfileButtonClick,
    };
  }, [rolesUIContext]);

  // Getting curret state of roles list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.roles }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;

  // Roles Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    rolesUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchRoles(rolesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: 'role_name',
      text: 'Role',
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: 'date',
      text: 'Date',
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'action',
      text: 'Actions',
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditCustomerDialog: rolesUIProps.openEditCustomerDialog,
        openDeleteCustomerDialog: rolesUIProps.openDeleteCustomerDialog,
      },
      classes: 'text-right pr-0',
      headerClasses: 'text-right pr-3',
      style: {
        minWidth: '100px',
      },
    },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: rolesUIProps.queryParams.pageSize,
    page: rolesUIProps.queryParams.pageNumber,
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
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  rolesUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: rolesUIProps.ids,
                  setIds: rolesUIProps.setIds,
                })}
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
