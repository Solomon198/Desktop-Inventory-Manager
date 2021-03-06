import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function CustomerEditDialogHeader({ id }) {
  // Customers Redux state
  const { supplierForEdit, actionsLoading } = useSelector(
    state => ({
      supplierForEdit: state.customers.supplierForEdit,
      actionsLoading: state.customers.actionsLoading
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Supplier";
    if (supplierForEdit && id) {
      _title = `Edit supplier '${supplierForEdit.supplier_name}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [supplierForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
