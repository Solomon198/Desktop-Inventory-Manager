import React, { useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import * as actions from '../../../_redux/employees/employeesActions';
import * as rolesActions from '../../../_redux/roles/rolesActions';
import { EmployeeEditDialogHeader } from './CustomerEditDialogHeader';
import { EmployeeEditForm } from './CustomerEditForm';
import { useEmployeesUIContext } from '../CustomersUIContext';
import { setSnackbar } from '../../../_redux/snackbar/snackbarActions';

export function EmployeeEditDialog({ id, show, onHide }) {
  //Employees UI Context
  const employeesUIContext = useEmployeesUIContext();
  const employeesUIProps = useMemo(() => {
    return {
      initEmployee: employeesUIContext.initEmployee,
      queryParams: employeesUIContext.queryParams,
    };
  }, [employeesUIContext]);

  // Employees Redux state
  const dispatch = useDispatch();
  const { actionsLoading, error, employeeForEdit, roleEntities } = useSelector(
    (state) => ({
      actionsLoading: state.employees.actionsLoading,
      error: state.employees.error,
      employeeForEdit: state.employees.employeeForEdit,
      roleEntities: state.roles.entities,
    }),
    shallowEqual
  );

  let _employeeForEdit;

  if (employeeForEdit) {
    _employeeForEdit = Object.assign({}, employeeForEdit, {
      date: moment(employeeForEdit.date).format('YYYY-MM-DD'),
    });
  }

  useEffect(() => {
    // server call for getting Employee by id
    dispatch(actions.fetchEmployee(id));
    // Server call for fetching all roles
    dispatch(rolesActions.fetchRoles(employeesUIProps.queryParams));
  }, [id, dispatch, employeesUIProps.queryParams]);

  // server request for saving employee
  const saveEmployee = (employee) => {
    if (!id) {
      // server request for creating employee
      dispatch(actions.createEmployee(employee)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>Employee created successfully!</p>
            ),
            show: true,
          })
        );
      });
    } else {
      // server request for updating employee
      dispatch(actions.updateEmployee(employee)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>Employee updated successfully!</p>
            ),
            show: true,
          })
        );
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <EmployeeEditDialogHeader id={id} />
      <EmployeeEditForm
        saveEmployee={saveEmployee}
        actionsLoading={actionsLoading}
        employee={_employeeForEdit || employeesUIProps.initEmployee}
        roleEntities={roleEntities}
        onHide={onHide}
      />
    </Modal>
  );
}
