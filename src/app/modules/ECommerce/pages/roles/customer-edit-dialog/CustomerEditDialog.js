import React, { useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/roles/rolesActions';
import { CustomerEditDialogHeader } from './CustomerEditDialogHeader';
import { CustomerEditForm } from './CustomerEditForm';
import { useCustomersUIContext } from '../CustomersUIContext';
import { setSnackbar } from '../../../_redux/snackbar/snackbarActions';

export function CustomerEditDialog({ id, show, onHide }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const rolesUIProps = useMemo(() => {
    return {
      initRole: customersUIContext.initRole,
      setShowSnackbar: customersUIContext.setShowSnackbar,
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, roleForEdit, error } = useSelector(
    (state) => ({
      actionsLoading: state.roles.actionsLoading,
      roleForEdit: state.roles.roleForEdit,
      error: state.roles.error,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Role by id
    dispatch(actions.fetchRole(id));
  }, [id, dispatch]);

  // server request for saving role
  const saveRole = (role) => {
    if (!id) {
      // server request for creating role
      dispatch(actions.createRole(role)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>Role added successfully!</p>
            ),
            show: true,
          })
        );
      });
    } else {
      // server request for updating role
      dispatch(actions.updateRole(role)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>Role updated successfully!</p>
            ),
            show: true,
          })
        );
      });
    }
  };

  return (
    <Modal
      size="md"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-md"
    >
      <CustomerEditDialogHeader id={id} />
      <CustomerEditForm
        saveRole={saveRole}
        actionsLoading={actionsLoading}
        role={roleForEdit || rolesUIProps.initRole}
        onHide={onHide}
      />
    </Modal>
  );
}
