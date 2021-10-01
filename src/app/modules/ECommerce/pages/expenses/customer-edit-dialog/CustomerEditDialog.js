import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import * as actions from '../../../_redux/expenses/expensesActions';
import { CustomerEditDialogHeader } from './CustomerEditDialogHeader';
import { CustomerEditForm } from './CustomerEditForm';
import { ExpensesItemForm } from './ExpensesItemForm';
import { useCustomersUIContext } from '../CustomersUIContext';
import helperFuns from '../../utils/helper.funcs';
import { setSnackbar } from '../../../_redux/snackbar/snackbarActions';

export function CustomerEditDialog({ id, show, onHide }) {
  // Create state for tabs
  // const [tab, setTab] = useState('basic');

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      initExpense: customersUIContext.initExpense,
      tab: customersUIContext.tab,
      setTab: customersUIContext.setTab,
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, error, expenseForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.expenses.actionsLoading,
      error: state.expenses.error,
      expenseForEdit: state.expenses.expenseForEdit,
    }),
    shallowEqual
  );

  let _expenseForEdit;

  if (expenseForEdit) {
    _expenseForEdit = Object.assign({}, expenseForEdit, {
      date: moment(expenseForEdit.date).format('YYYY-MM-DD'),
    });
  }

  useEffect(() => {
    // server call for getting Expense by id
    dispatch(actions.fetchExpense(id));
  }, [id, dispatch, customersUIProps.tab]);

  // server request for saving expense
  const saveExpense = (values, resetForm) => {
    if (!id) {
      // server request for creating expense
      let newValues = { ...values };
      let _date = helperFuns.transformDateStringToDateType(newValues.date);

      // try {
      // } catch (e) {}

      let _saveExpense = {
        expense_item_id: newValues.expense_item_id,
        expense_item: newValues.expense_item,
        amount: newValues.amount,
        description: newValues.description,
        date: new Date(_date),
      };

      dispatch(actions.createExpense(_saveExpense)).then(() => {
        onHide();
        // show snackbar message
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>Expense created successfully!</p>
            ),
            show: true,
          })
        );
      });
      resetForm({ values: '' });
    } else {
      // server request for updating expense
      dispatch(actions.updateExpense(values)).then(() => {
        onHide();
        // show snackbar message
        dispatch(
          setSnackbar({
            status: !error ? 'success' : 'error',
            message: (
              <p style={{ fontSize: '16px' }}>Expense updated successfully!</p>
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
            Basis Info
          </a>
        </li>
        <li
          className="nav-item"
          onClick={() => customersUIProps.setTab('expenseItem')}
        >
          <a
            className={`nav-link ${customersUIProps.tab === 'expenseItem' &&
              'active'}`}
            data-toggle="tab"
            role="tab"
            aria-selected={(customersUIProps.tab === 'expenseItem').toString()}
          >
            Add Expense
          </a>
        </li>
      </ul>
      <div className="mt-5">
        {customersUIProps.tab === 'basic' && (
          <CustomerEditForm
            saveExpense={saveExpense}
            actionsLoading={actionsLoading}
            expense={_expenseForEdit || customersUIProps.initExpense}
            onHide={onHide}
          />
        )}
        {customersUIProps.tab === 'expenseItem' && (
          <ExpensesItemForm onHide={onHide} />
        )}
      </div>
    </Modal>
  );
}
