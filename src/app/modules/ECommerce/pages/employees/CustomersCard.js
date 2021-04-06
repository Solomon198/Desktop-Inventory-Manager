import React, { useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../_metronic/_partials/controls';
import { CustomersFilter } from './customers-filter/CustomersFilter';
import { EmployeesTable } from './customers-table/CustomersTable';
import { EmployeesGrouping } from './customers-grouping/CustomersGrouping';
import { useEmployeesUIContext } from './CustomersUIContext';

export function EmployeesCard() {
  const employeesUIContext = useEmployeesUIContext();
  const employeesUIProps = useMemo(() => {
    return {
      ids: employeesUIContext.ids,
      newEmployeeButtonClick: employeesUIContext.newEmployeeButtonClick,
    };
  }, [employeesUIContext]);

  return (
    <Card>
      <CardHeader title="Employees list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={employeesUIProps.newEmployeeButtonClick}
          >
            New Employee
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <CustomersFilter />
        {employeesUIProps.ids.length > 0 && <EmployeesGrouping />}
        <EmployeesTable />
      </CardBody>
    </Card>
  );
}
