/* eslint-disable no-restricted-imports */
import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/sales/salesActions";
import { useSalesUIContext } from "../ProductsUIContext";

export function ProductDeleteDialog({ id, show, onHide }) {
  // Products UI Context
  const salesUIContext = useSalesUIContext();
  const salesUIProps = useMemo(() => {
    return {
      setIds: salesUIContext.setIds,
      queryParams: salesUIContext.queryParams
    };
  }, [salesUIContext]);

  // Products Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    state => ({ isLoading: state.sales.actionsLoading }),
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
  // useEffect(() => {}, [isLoading, dispatch]);

  // const deleteSale = () => {
  //   // server request for deleting product by id
  //   dispatch(actions.deleteSale(id)).then(() => {
  //     // refresh list after deletion
  //     dispatch(actions.fetchProducts(salesUIProps.queryParams));
  //     // clear selections list
  //     salesUIProps.setIds([]);
  //     // closing delete modal
  //     onHide();
  //   });
  // };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {isLoading && <ModalProgressBar variant="query" />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Product Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete this product?</span>
        )}
        {isLoading && <span>Product is deleting...</span>}
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
          {/* <button
            type="button"
            onClick={deleteSale}
            className="btn btn-delete btn-elevate"
          >
            Delete
          </button> */}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
