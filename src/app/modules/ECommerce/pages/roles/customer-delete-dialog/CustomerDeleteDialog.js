import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/roles/rolesActions";
import { useCustomersUIContext } from "../CustomersUIContext";
import { setSnackbar } from "../../../_redux/snackbar/snackbarActions";

export function CustomerDeleteDialog({ id, show, onHide }) {
  // Roles UI Context
  const rolesUIContext = useCustomersUIContext();
  const rolesUIProps = useMemo(() => {
    return {
      setIds: rolesUIContext.setIds,
      queryParams: rolesUIContext.queryParams
    };
  }, [rolesUIContext]);

  // Roles Redux state
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(
    state => ({
      isLoading: state.roles.actionsLoading,
      error: state.roles.error
    }),
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

  const deleteRole = () => {
    // server request for deleting customer by id
    dispatch(actions.deleteRole(id)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchRoles(rolesUIProps.queryParams));
      // clear selections list
      rolesUIProps.setIds([]);
      // closing delete modal
      onHide();
      dispatch(
        setSnackbar({
          status: !error ? "success" : "error",
          message: (
            <p style={{ fontSize: "16px" }}>Role deleted successfully!</p>
          ),
          show: true
        })
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
        <Modal.Title id="example-modal-sizes-title-lg">Role Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete this role?</span>
        )}
        {isLoading && <span>Role is deleting...</span>}
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
            onClick={deleteRole}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
