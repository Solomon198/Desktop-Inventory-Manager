import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function CustomerEditDialogHeader({ id }) {
  // Customers Redux state
  const { unitForEdit, actionsLoading } = useSelector(
    state => ({
      unitForEdit: state.units.unitForEdit,
      actionsLoading: state.units.actionsLoading
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Unit";
    if (unitForEdit && id) {
      _title = `Edit Unit '${unitForEdit.name}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [unitForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
