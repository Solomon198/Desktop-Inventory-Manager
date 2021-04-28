/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { shallowEqual, useSelector } from 'react-redux';
import * as actions from '../../../_redux/expenses/expensesActions';
import helpers from '../../utils/helper.funcs';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls';
import { ProductEditForm } from './ProductEditForm';
import { Specifications } from '../product-specifications/Specifications';
import { SpecificationsUIProvider } from '../product-specifications/SpecificationsUIContext';
import { useSubheader } from '../../../../../../_metronic/layout';
import { ModalProgressBar } from '../../../../../../_metronic/_partials/controls';
import { RemarksUIProvider } from '../product-remarks/RemarksUIContext';
import { Remarks } from '../product-remarks/Remarks';

const initExpense = {
  id: undefined,
  item: '',
  description: '',
  amount: 0,
  date: '',
};

export function ExpenseEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();

  // Tabs
  const [tab, setTab] = useState('basic');
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, expenseForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.expenses.actionsLoading,
      expenseForEdit: state.expenses.expenseForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchExpense(id));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? '' : 'New Expense';
    if (expenseForEdit && id) {
      _title = `Edit expense '${expenseForEdit.item}'`;
    }

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseForEdit, id]);

  const saveExpense = (values) => {
    if (!id) {
      dispatch(actions.createExpense(values)).then(() => backToExpensesList());
    } else {
      dispatch(actions.updateExpense(values)).then(() => backToExpensesList());
    }
  };

  const btnRef = useRef();
  const saveExpenseClick = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const backToExpensesList = () => {
    history.push(`/e-commerce/expenses`);
  };

  return (
    <Card>
      {actionsLoading && <ModalProgressBar />}
      <CardHeader title={title}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToExpensesList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button className="btn btn-light ml-2">
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveExpenseClick}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ul className="nav nav-tabs nav-tabs-line " role="tablist">
          <li className="nav-item" onClick={() => setTab('basic')}>
            <a
              className={`nav-link ${tab === 'basic' && 'active'}`}
              data-toggle="tab"
              role="tab"
              aria-selected={(tab === 'basic').toString()}
            >
              Basic info
            </a>
          </li>
          {id && (
            <>
              {' '}
              <li className="nav-item" onClick={() => setTab('remarks')}>
                <a
                  className={`nav-link ${tab === 'remarks' && 'active'}`}
                  data-toggle="tab"
                  role="button"
                  aria-selected={(tab === 'remarks').toString()}
                >
                  Product remarks
                </a>
              </li>
              <li className="nav-item" onClick={() => setTab('specs')}>
                <a
                  className={`nav-link ${tab === 'specs' && 'active'}`}
                  data-toggle="tab"
                  role="tab"
                  aria-selected={(tab === 'specs').toString()}
                >
                  Product specifications
                </a>
              </li>
            </>
          )}
        </ul>
        <div className="mt-5">
          {tab === 'basic' && (
            <ProductEditForm
              actionsLoading={actionsLoading}
              expense={expenseForEdit || initExpense}
              btnRef={btnRef}
              saveExpense={saveExpense}
            />
          )}
          {tab === 'remarks' && id && (
            <RemarksUIProvider currentProductId={id}>
              <Remarks />
            </RemarksUIProvider>
          )}
          {tab === 'specs' && id && (
            <SpecificationsUIProvider currentProductId={id}>
              <Specifications />
            </SpecificationsUIProvider>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
