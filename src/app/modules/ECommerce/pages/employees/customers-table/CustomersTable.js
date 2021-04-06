// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/employees/employeesActions';
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
import { useEmployeesUIContext } from '../CustomersUIContext';

export function EmployeesTable() {
  // Employees UI Context
  const employeesUIContext = useEmployeesUIContext();
  const employeesUIProps = useMemo(() => {
    return {
      ids: employeesUIContext.ids,
      setIds: employeesUIContext.setIds,
      queryParams: employeesUIContext.queryParams,
      setQueryParams: employeesUIContext.setQueryParams,
      openEditEmployeeDialog: employeesUIContext.openEditEmployeeDialog,
      openDeleteEmployeeDialog: employeesUIContext.openDeleteEmployeeDialog,
    };
  }, [employeesUIContext]);

  // Getting curret state of employees list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.employees }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;

  // Employees Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    employeesUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchEmployees(employeesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeesUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: 'first_name',
      text: 'Firstname',
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: 'last_name',
      text: 'Lastname',
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: 'gender',
      text: 'Gender',
      sort: false,
      sortCaret: sortCaret,
    },
    {
      dataField: 'role',
      text: 'Role',
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    // {
    //   dataField: 'status',
    //   text: 'Status',
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.StatusColumnFormatter,
    //   headerSortingClasses,
    // },
    // {
    //   dataField: 'cus_type',
    //   text: 'Type',
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.TypeColumnFormatter,
    // },
    {
      dataField: 'action',
      text: 'Actions',
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditEmployeeDialog: employeesUIProps.openEditEmployeeDialog,
        openDeleteEmployeeDialog: employeesUIProps.openDeleteEmployeeDialog,
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
    sizePerPage: employeesUIProps.queryParams.pageSize,
    page: employeesUIProps.queryParams.pageNumber,
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
                keyField="title"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  employeesUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: employeesUIProps.ids,
                  setIds: employeesUIProps.setIds,
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
