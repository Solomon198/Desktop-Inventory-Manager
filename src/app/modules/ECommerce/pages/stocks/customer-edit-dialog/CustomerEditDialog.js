import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../_redux/stocks/stocksActions';
import * as stockEntryActions from '../../../_redux/stocksEntry/stocksEntryActions';
import { CustomerEditDialogHeader } from './CustomerEditDialogHeader';
import { CustomerEditForm } from './CustomerEditForm';
import { UnitForm } from './UnitForm';
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
      initStock: customersUIContext.initStock,
      tab: customersUIContext.tab,
      setTab: customersUIContext.setTab,
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, error, stockForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.stocks.actionsLoading,
      error: state.stocks.error,
      stockForEdit: state.stocks.stockForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Stock by id
    dispatch(actions.fetchStock(id));
  }, [id, dispatch, customersUIProps.tab]);

  // server request for saving stock
  const saveStock = (values, resetForm) => {
    if (!id) {
      // server request for creating stock
      let newValues = { ...values };
      let _date = helperFuns.transformDateStringToDateType(newValues.date);

      let _saveStock = {
        product_id: newValues.product_id,
        unit_id: newValues.unit_id,
        product_name: newValues.product_name,
        unit_name: newValues.unit_name,
        quantity: newValues.quantity,
        date: new Date(_date),
      };

      let _saveStockEntry = {
        product_id: newValues.product_id,
        unit_id: newValues.unit_id,
        product_name: newValues.product_name,
        unit_name: newValues.unit_name,
        quantity: newValues.quantity,
      };

      // dispatch(stockActions.createStock(_saveStock));
      dispatch(actions.createStock(_saveStock)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>
                {!error ? `Stock created successfully!` : error}
              </p>
            ),
            show: true,
          })
        );
      });
      dispatch(stockEntryActions.createStockEntry(_saveStockEntry)).then(() =>
        onHide()
      );
      resetForm({ values: '' });
    } else {
      // server request for updating stock
      dispatch(actions.updateStock(values)).then(() => {
        onHide();
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>
                {!error ? `Stock updated successfully!` : error}
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
      <ul className="nav nav-tabs nav-tabs-line ml-5 " role="tablist">
        <li
          className="nav-item"
          onClick={() => customersUIProps.setTab('basic')}
        >
          <a
            className={`nav-link ${customersUIProps.tab === 'basic' &&
              'active'}`}
            data-toggle="tab"
            role="tab"
            aria-selected={(customersUIProps.tab === 'basic').toString()}
          >
            Add Stock
          </a>
        </li>
        <li
          className="nav-item"
          onClick={() => customersUIProps.setTab('unit')}
        >
          <a
            className={`nav-link ${customersUIProps.tab === 'unit' &&
              'active'}`}
            data-toggle="tab"
            role="tab"
            aria-selected={(customersUIProps.tab === 'unit').toString()}
          >
            Unit for product
          </a>
        </li>
      </ul>
      <div className="mt-5">
        {customersUIProps.tab === 'basic' && (
          <CustomerEditForm
            saveStock={saveStock}
            actionsLoading={actionsLoading}
            stock={stockForEdit || customersUIProps.initStock}
            onHide={onHide}
          />
        )}
        {customersUIProps.tab === 'unit' && <UnitForm onHide={onHide} />}
      </div>
    </Modal>
  );
}
