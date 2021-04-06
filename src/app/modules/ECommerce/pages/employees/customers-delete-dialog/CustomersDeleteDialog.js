import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/employees/employeesActions";
import { useEmployeesUIContext } from "../CustomersUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function EmployeesDeleteDialog({ show, onHide }) {
  // Employees UI Context
  const employeesUIContext = useEmployeesUIContext();
  const employeesUIProps = useMemo(() => {
    return {
      ids: employeesUIContext.ids,
      setIds: employeesUIContext.setIds,
      queryParams: employeesUIContext.queryParams
    };
  }, [employeesUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    state => ({ isLoading: state.employees.actionsLoading }),
    shallowEqual
  );

  // if employees weren't selected we should close modal
  useEffect(() => {
    if (!employeesUIProps.ids || employeesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeesUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteEmployees = () => {
    // server request for deleting employee by selected ids
    dispatch(actions.deleteEmployees(employeesUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchEmployees(employeesUIProps.queryParams)).then(
        () => {
          // clear selections list
          employeesUIProps.setIds([]);
          // closing delete modal
          onHide();
        }
      );
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Employees Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected employees?</span>
        )}
        {isLoading && <span>Employees are deleting...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteEmployees}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
