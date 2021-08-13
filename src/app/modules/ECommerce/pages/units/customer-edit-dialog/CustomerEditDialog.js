import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/units/unitsActions";
import { CustomerEditDialogHeader } from "./CustomerEditDialogHeader";
import { CustomerEditForm } from "./CustomerEditForm";
import { useCustomersUIContext } from "../CustomersUIContext";
import helperFuns from "../../utils/helper.funcs";

export function CustomerEditDialog({ id, show, onHide }) {
  // Create state for tabs
  // const [tab, setTab] = useState('stock');

  // Customers UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      initUnit: customersUIContext.initUnit
    };
  }, [customersUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, unitForEdit } = useSelector(
    state => ({
      actionsLoading: state.units.actionsLoading,
      unitForEdit: state.units.unitForEdit
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Stock by id
    dispatch(actions.fetchUnit(id));
  }, [id, dispatch]);

  // server request for saving stock
  const saveUnit = (values, resetForm) => {
    if (!id) {
      console.log(values);
      // dispatch(stockActions.createStock(_saveStock));
      dispatch(actions.createUnit(values)).then(() => onHide());
      resetForm({ values: "" });
    } else {
      let _newValues = Object.assign({}, values);
      _newValues.price = parseInt(_newValues.price);
      // server request for updating stock
      dispatch(actions.updateUnit(_newValues)).then(() => onHide());
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
        unit={unitForEdit || customersUIProps.initUnit}
        onHide={onHide}
      />
    </Modal>
  );
}
