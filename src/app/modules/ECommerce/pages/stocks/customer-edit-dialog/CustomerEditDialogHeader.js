import React, { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { ModalProgressBar } from '../../../../../../_metronic/_partials/controls';

export function CustomerEditDialogHeader({ id }) {
  // Customers Redux state
  const { stockForEdit, actionsLoading } = useSelector(
    (state) => ({
      stockForEdit: state.stocks.stockForEdit,
      actionsLoading: state.stocks.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState('');
  // Title couting
  useEffect(() => {
    let _title = id ? '' : 'New Stock';
    if (stockForEdit && id) {
      _title = `Edit stock '${stockForEdit.product_name}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [stockForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
