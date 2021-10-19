import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Typography from "@material-ui/core/Typography";
import helperFuns from "../../utils/helper.funcs";
import { useCustomersUIContext } from "../CustomersUIContext";

export function CustomerTransactionPreviewDialogHeader({ id }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();

  // Customers Redux state
  const { entities, actionsLoading } = useSelector(
    state => ({
      entities: state.customers.entities,
      actionsLoading: state.customers.actionsLoading
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  let customer;
  // Title couting
  useEffect(() => {
    let _title;
    customer = entities && entities.find(customer => customer._id === id);
    if (id && customer) {
      _title = `${customer.first_name} ${customer.last_name}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [entities, customer, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
