import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/customers/customersActions";
import { CustomerTransactionPreviewDialogHeader } from "./CustomerTransactionPreviewDialogHeader";
// import * as actions from '../../../_redux/sales/salesActions';
import helperFuns from "../../utils/helper.funcs";
import { useCustomersUIContext } from "../CustomersUIContext";
import { CustomerTransactionTable } from "./CustomerTransactionTable";
import CustomerTransactionForm from "./CustomerTransactionForm";

export function CustomerTransactionPreviewDialog({ id, show, onHide }) {
  // Customers UI Context
  const customersUIContext = useCustomersUIContext;
  const customersUIProps = useMemo(() => {
    return {
      productsSelected: customersUIContext.productsSelected
    };
  }, [customersUIContext]);

  console.log("Products Selectd", customersUIProps.productsSelected);

  let grossTotal;
  if (customersUIProps.productsSelected) {
    customersUIProps.productsSelected.map(prod => {
      let _prod = { ...prod };

      _prod.totalAmount = helperFuns.transformCurrencyStringToNumber(
        _prod.totalAmount
      );
      grossTotal += _prod.totalAmount;
    });
  }

  if (grossTotal) {
    console.log("Gross Total", grossTotal);
  }
  // Customers UI Context
  //   const customersUIContext = useCustomersUIContext();
  //   const customersUIProps = useMemo(() => {
  //     return {
  //       initCustomer: customersUIContext.initCustomer,
  //       productsSelected: customersUIContext.productsSelected,
  //     };
  //   }, [customersUIContext]);

  // Customers Redux state
  //   const dispatch = useDispatch();
  //   const { actionsLoading, customerForEdit } = useSelector(
  //     (state) => ({
  //       actionsLoading: state.customers.actionsLoading,
  //       customerForEdit: state.customers.customerForEdit,
  //     }),
  //     shallowEqual
  //   );

  //   useEffect(() => {
  //     // server call for getting Customer by id
  //     dispatch(actions.fetchCustomer(id));
  //   }, [id, dispatch]);

  // server request for saving customer
  //   const saveCustomer = (customer) => {
  //     if (!id) {
  //       // server request for creating customer
  //       dispatch(actions.createCustomer(customer)).then(() => onHide());
  //     } else {
  //       // server request for updating customer
  //       dispatch(actions.updateCustomer(customer)).then(() => onHide());
  //     }
  //   };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/* <CustomerEditDialogHeader id={id} /> */}
      <CustomerTransactionPreviewDialogHeader id={id} />
      <Modal.Body>
        <CustomerTransactionTable />
        <br />
        <hr />
        <br />
        <CustomerTransactionForm />
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-default"
          onClick={() => alert("Transaction will be cancelled")}
        >
          Cancel Transaction
        </button>
      </Modal.Footer>
    </Modal>
  );
}
