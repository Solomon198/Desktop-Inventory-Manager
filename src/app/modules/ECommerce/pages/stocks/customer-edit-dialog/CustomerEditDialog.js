import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/customers/customersActions";
import { CustomerEditDialogHeader } from "./CustomerEditDialogHeader";
import { CustomerEditForm } from "./CustomerEditForm";
import { UnitForm } from "./UnitForm";
import { useCustomersUIContext } from "../CustomersUIContext";

export function CustomerEditDialog({ id, show, onHide }) {
  // Create state for tabs
  const [tab, setTab] = useState("stock");

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      initCustomer: customersUIContext.initCustomer
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, customerForEdit } = useSelector(
    state => ({
      actionsLoading: state.customers.actionsLoading,
      customerForEdit: state.customers.customerForEdit
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Customer by id
    dispatch(actions.fetchCustomer(id));
  }, [id, dispatch]);

  // server request for saving customer
  const saveCustomer = customer => {
    if (!id) {
      // server request for creating customer
      dispatch(actions.createCustomer(customer)).then(() => onHide());
    } else {
      // server request for updating customer
      dispatch(actions.updateCustomer(customer)).then(() => onHide());
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
        <li className="nav-item" onClick={() => setTab("stock")}>
          <a
            className={`nav-link ${tab === "stock" && "active"}`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "stock").toString()}
          >
            Add Stock
          </a>
        </li>
        <li className="nav-item" onClick={() => setTab("unit")}>
          <a
            className={`nav-link ${tab === "unit" && "active"}`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "unit").toString()}
          >
            Unit for product
          </a>
        </li>
      </ul>
      <div className="mt-5">
        {tab === "stock" && (
          <CustomerEditForm
            saveCustomer={saveCustomer}
            actionsLoading={actionsLoading}
            customer={customerForEdit || customersUIProps.initCustomer}
            onHide={onHide}
          />
        )}
        {tab === "unit" && <UnitForm />}
      </div>
    </Modal>
  );
}
