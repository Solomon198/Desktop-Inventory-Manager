import React from "react";

export function ProductsList({ entities, handleSelect }) {
  return (
    <>
      <div className="form-group">
        <label>Products</label>
        <select
          onChange={e => handleSelect(e.target.value)}
          className="form-control"
        >
          <option value={"01"}>---Select a product---</option>
          {entities.map(entity => (
            <option key={entity._id} value={entity._id}>
              {entity.product_name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
