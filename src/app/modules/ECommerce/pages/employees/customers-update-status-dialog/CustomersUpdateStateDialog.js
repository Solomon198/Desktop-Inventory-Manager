import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  CustomerStatusCssClasses,
  CustomerStatusTitles
} from "../CustomersUIHelpers";
import * as actions from "../../../_redux/employees/employeesActions";
import { useEmployeesUIContext } from "../CustomersUIContext";

const selectedEmployees = (entities, ids) => {
  const _employees = [];
  ids.forEach(id => {
    const employee = entities.find(el => el.id === id);
    if (employee) {
      _employees.push(employee);
    }
  });
  return _employees;
};

export function EmployeesUpdateStateDialog({ show, onHide }) {
  // Employees UI Context
  const employeesUIContext = useEmployeesUIContext();
  const employeesUIProps = useMemo(() => {
    return {
      ids: employeesUIContext.ids,
      setIds: employeesUIContext.setIds,
      queryParams: employeesUIContext.queryParams
    };
  }, [employeesUIContext]);

  // Employees Redux state
  const { employees, isLoading } = useSelector(
    state => ({
      employees: selectedEmployees(
        state.employees.entities,
        employeesUIProps.ids
      ),
      isLoading: state.employees.actionsLoading
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!employeesUIProps.ids || employeesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeesUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  // const updateStatus = () => {
  //   // server request for update employees status by selected ids
  //   dispatch(actions.updateCustomersStatus(employeesUIProps.ids, status)).then(
  //     () => {
  //       // refresh list after deletion
  //       dispatch(actions.fetchCustomers(employeesUIProps.queryParams)).then(
  //         () => {
  //           // clear selections list
  //           employeesUIProps.setIds([]);
  //           // closing delete modal
  //           onHide();
  //         }
  //       );
  //     }
  //   );
  // };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Status has been updated for selected employees
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {/*begin::Loading*/}
        {isLoading && (
          <div className="overlay-layer">
            <div className="spinner spinner-lg spinner-primary" />
          </div>
        )}
        {/*end::Loading*/}
        <table className="table table table-head-custom table-vertical-center overflow-hidden">
          <thead>
            <tr>
              <th>ID</th>
              <th>STATUS</th>
              <th>CUSTOMER</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={`id${employee.id}`}>
                <td>{employee.id}</td>
                {/* <td>
                  <span
                    className={`label label-lg label-light-${
                      CustomerStatusCssClasses[employee.status]
                    } label-inline`}
                  >
                    {' '}
                    {CustomerStatusTitles[employee.status]}
                  </span>
                </td> */}
                <td>
                  <span className="ml-3">
                    {employee.lastName}, {employee.firstName}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer className="form">
        {/* <div className="form-group">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Suspended</option>
            <option value="1">Active</option>
            <option value="2">Pending</option>
          </select>
        </div> */}
        <div className="form-group">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            // onClick={updateStatus}
            className="btn btn-primary btn-elevate"
          >
            Update Status
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
