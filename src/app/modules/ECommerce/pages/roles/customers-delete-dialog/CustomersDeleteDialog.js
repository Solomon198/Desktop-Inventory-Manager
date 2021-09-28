import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/roles/rolesActions";
import { useCustomersUIContext } from "../CustomersUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { setSnackbar } from "../../../_redux/snackbar/snackbarActions";

export function CustomersDeleteDialog({ show, onHide }) {
  // Roles UI Context
  const rolesUIContext = useCustomersUIContext();
  const rolesUIProps = useMemo(() => {
    return {
      ids: rolesUIContext.ids,
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

  // if roles weren't selected we should close modal
  useEffect(() => {
    if (!rolesUIProps.ids || rolesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteRoles = () => {
    // server request for deleting roles by selected ids
    dispatch(actions.deleteRoles(rolesUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchRoles(rolesUIProps.queryParams)).then(() => {
        // clear selections list
        rolesUIProps.setIds([]);
        // closing delete modal
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Roles deleted successfully!</p>
            ),
            show: true
          })
        );
      });
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
          Roles Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected roles?</span>
        )}
        {isLoading && <span>Roles are deleting...</span>}
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
            onClick={deleteRoles}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
