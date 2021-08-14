import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function UnitConversionHeader() {
  const [title, setTitle] = useState("");

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-md">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
