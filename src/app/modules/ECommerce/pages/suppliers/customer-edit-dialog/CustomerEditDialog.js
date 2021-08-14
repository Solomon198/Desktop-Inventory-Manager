import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/suppliers/suppliersActions";
import { CustomerEditDialogHeader } from "./CustomerEditDialogHeader";
import { CustomerEditForm } from "./CustomerEditForm";
import { useCustomersUIContext } from "../CustomersUIContext";

export function CustomerEditDialog({ id, show, onHide }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      initSupplier: customersUIContext.initSupplier
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, supplierForEdit } = useSelector(
    state => ({
      actionsLoading: state.suppliers.actionsLoading,
      supplierForEdit: state.suppliers.supplierForEdit
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Customer by id
    dispatch(actions.fetchSupplier(id));
  }, [id, dispatch]);

  // server request for saving supplier
  const saveSupplier = supplier => {
    if (!id) {
      // server request for creating supplier
      dispatch(actions.createSupplier(supplier)).then(() => onHide());
    } else {
      // server request for updating supplier
      dispatch(actions.updateSupplier(supplier)).then(() => onHide());
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <CustomerEditDialogHeader id={id} />
      <CustomerEditForm
        saveSupplier={saveSupplier}
        actionsLoading={actionsLoading}
        supplier={supplierForEdit || customersUIProps.initSupplier}
        onHide={onHide}
      />
    </Modal>
  );
}
