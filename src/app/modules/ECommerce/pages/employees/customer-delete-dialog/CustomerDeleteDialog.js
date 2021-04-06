import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/employees/employeesActions";
import { useEmployeesUIContext } from "../CustomersUIContext";

export function EmployeeDeleteDialog({ id, show, onHide }) {
  // Employees UI Context
  const employeesUIContext = useEmployeesUIContext();
  const employeesUIProps = useMemo(() => {
    return {
      setIds: employeesUIContext.setIds,
      queryParams: employeesUIContext.queryParams
    };
  }, [employeesUIContext]);

  // Employees Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    state => ({ isLoading: state.employees.actionsLoading }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteEmployee = () => {
    // server request for deleting customer by id
    dispatch(actions.deleteEmployee(id)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchEmployees(employeesUIProps.queryParams));
      // clear selections list
      employeesUIProps.setIds([]);
      // closing delete modal
      onHide();
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
          Employee Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete this employee?</span>
        )}
        {isLoading && <span>Employee is deleting...</span>}
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
            onClick={deleteEmployee}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
