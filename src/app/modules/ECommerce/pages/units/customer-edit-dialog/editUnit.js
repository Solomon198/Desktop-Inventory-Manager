import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useCustomersUIContext } from "../CustomersUIContext";

export function EditUnit({ id, show, onHide }) {
  const customersUIContext = useCustomersUIContext;
  const customersUIProps = useMemo(
    () => ({
      initUnit: customersUIContext.initUnit
    }),
    [customersUIContext]
  );

  const { name } = customersUIProps.initUnit;

  const handleSubmit = () => {
    console.log(name);
  };

  return (
    <Modal size="md" show={show} onHide={onHide}>
      <form>
        <div className="form-group">
          <label>Unit Name:</label>
          <input name="name" value={name} onChange={e => e.target.value} />
        </div>

        <div className="form-group">
          <input type="submit" value="Update" onClick={handleSubmit} />
        </div>
      </form>
    </Modal>
  );
}
