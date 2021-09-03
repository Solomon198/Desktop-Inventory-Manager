import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/stocks/stocksActions";
import { useCustomersUIContext } from "../CustomersUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { setSnackbar } from "../../../_redux/snackbar/snackbarActions";

export function CustomersDeleteDialog({ show, onHide }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      setIds: customersUIContext.setIds,
      queryParams: customersUIContext.queryParams
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(
    state => ({
      isLoading: state.stocks.actionsLoading,
      error: state.units.error
    }),
    shallowEqual
  );

  // if customers weren't selected we should close modal
  useEffect(() => {
    if (!customersUIProps.ids || customersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customersUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteStocks = () => {
    // server request for deleting customer by selected ids
    dispatch(actions.deleteStocks(customersUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchStocks(customersUIProps.queryParams)).then(() => {
        // clear selections list
        customersUIProps.setIds([]);
        // closing delete modal
        onHide();
        // show snackbar message
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Units deleted successfully!</p>
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
          Stocks Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected stocks?</span>
        )}
        {isLoading && <span>Stocks are deleting...</span>}
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
            onClick={deleteStocks}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
