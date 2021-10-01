import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as moment from "moment";
import * as actions from "../../../_redux/customers/customersActions";
import { CustomerEditDialogHeader } from "./CustomerEditDialogHeader";
import { CustomerEditForm } from "./CustomerEditForm";
import { useCustomersUIContext } from "../CustomersUIContext";
import { setSnackbar } from "../../../_redux/snackbar/snackbarActions";

export function CustomerEditDialog({ id, show, onHide }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      initCustomer: customersUIContext.initCustomer,
      setShowSnackbar: customersUIContext.setShowSnackbar
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, customerForEdit, error } = useSelector(
    state => ({
      actionsLoading: state.customers.actionsLoading,
      customerForEdit: state.customers.customerForEdit,
      error: state.customers.error
    }),
    shallowEqual
  );

  let _customerForEdit;

  if (customerForEdit) {
    _customerForEdit = Object.assign({}, customerForEdit, {
      date: moment(customerForEdit.date).format("YYYY-MM-DD")
    });
  }

  useEffect(() => {
    // server call for getting Customer by id
    dispatch(actions.fetchCustomer(id));
  }, [id, dispatch]);

  // server request for saving customer
  const saveCustomer = customer => {
    if (!id) {
      // server request for creating customer
      dispatch(actions.createCustomer(customer)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Customer added successfully!</p>
            ),
            show: true
          })
        );
      });
    } else {
      // server request for updating customer
      dispatch(actions.updateCustomer(customer)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? "success" : "error",
            message: (
              <p style={{ fontSize: "16px" }}>Customer updated successfully!</p>
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
        saveCustomer={saveCustomer}
        actionsLoading={actionsLoading}
        customer={_customerForEdit || customersUIProps.initCustomer}
        onHide={onHide}
      />
    </Modal>
  );
}
