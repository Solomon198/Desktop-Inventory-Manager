import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as moment from "moment";
import * as actions from "../../../_redux/suppliers/suppliersActions";
import { CustomerEditDialogHeader } from "./CustomerEditDialogHeader";
import { CustomerEditForm } from "./CustomerEditForm";
import { useCustomersUIContext } from "../CustomersUIContext";
import { setSnackbar } from "../../../_redux/snackbar/snackbarActions";

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
  const { actionsLoading, error, supplierForEdit } = useSelector(
    state => ({
      actionsLoading: state.suppliers.actionsLoading,
      error: state.suppliers.error,
      supplierForEdit: state.suppliers.supplierForEdit
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Customer by id
    dispatch(actions.fetchSupplier(id));
  }, [id, dispatch]);

  let _supplierForEdit;

  if (supplierForEdit) {
    _supplierForEdit = Object.assign({}, supplierForEdit, {
      date: moment(supplierForEdit.date).format("YYYY-MM-DD")
    });
  }

  // server request for saving supplier
  const saveSupplier = supplier => {
    if (!id) {
      // server request for creating supplier
      dispatch(actions.createSupplier(supplier)).then(() => {
        onHide();
        // show snackbar message
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Supplier created successfully!</p>
            ),
            show: true
          })
        );
      });
    } else {
      // server request for updating supplier
      dispatch(actions.updateSupplier(supplier)).then(() => {
        onHide();
        // show snackbar message
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Supplier updated successfully!</p>
            ),
            show: true
          })
        );
      });
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
        supplier={_supplierForEdit || customersUIProps.initSupplier}
        onHide={onHide}
      />
    </Modal>
  );
}
