import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import * as actions from '../../../_redux/units/unitsActions';
import { CustomerEditDialogHeader } from './CustomerEditDialogHeader';
import { CustomerEditForm } from './CustomerEditForm';
import { useCustomersUIContext } from '../CustomersUIContext';
import helperFuns from '../../utils/helper.funcs';
import { setSnackbar } from '../../../_redux/snackbar/snackbarActions';

export function CustomerEditDialog({ id, show, onHide }) {
  // Create state for tabs
  // const [tab, setTab] = useState('stock');

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      initUnit: customersUIContext.initUnit,
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, error, unitForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.units.actionsLoading,
      error: state.units.error,
      unitForEdit: state.units.unitForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Stock by id
    dispatch(actions.fetchUnit(id));
  }, [id, dispatch]);

  let _unitForEdit;

  if (unitForEdit) {
    _unitForEdit = Object.assign({}, unitForEdit, {
      date: moment(unitForEdit.date).format('YYYY-MM-DD'),
    });
  }

  // server request for saving stock
  const saveUnit = (values, resetForm) => {
    if (!id) {
      dispatch(actions.createUnit(values)).then(() => {
        onHide();
        // show snackbar message
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>
                {!error ? 'Unit created successfully!' : error}
              </p>
            ),
            show: true,
          })
        );
      });
      resetForm({ values: '' });
    } else {
      let _newValues = Object.assign({}, values);
      // server request for updating stock
      dispatch(actions.updateUnit(_newValues)).then(() => {
        onHide();
        // show snackbar message
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>
                {!error ? 'Unit updated successfully!' : error}
              </p>
            ),
            show: true,
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
        saveUnit={saveUnit}
        actionsLoading={actionsLoading}
        unit={_unitForEdit || customersUIProps.initUnit}
        onHide={onHide}
      />
    </Modal>
  );
}
