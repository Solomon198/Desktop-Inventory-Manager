import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";
import * as actions from "../../_redux/products/productsActions";
import * as unitActions from "../../_redux/units/unitsActions";
import { CustomersTable } from "./customers-table/CustomersTable";
import { ProductsList } from "./products-list/ProductsList";
import { useCustomersUIContext } from "./CustomersUIContext";

export function CustomersCard() {
  const [productId, setProductId] = useState("");

  const customersUIContext = useCustomersUIContext();

  const { productEntities, unitCurrentState } = useSelector(state => ({
    productEntities: state.products.entities,
    unitCurrentState: state.units
  }));

  const { entities, totalCount, listLoading } = unitCurrentState;

  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      queryParams: customersUIContext.queryParams,
      newCustomerButtonClick: customersUIContext.newCustomerButtonClick
    };
  }, [customersUIContext]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchProducts(customersUIProps.queryParams));
    dispatch(unitActions.fetchUnitsForProduct(productId));
  }, [customersUIProps.queryParams, dispatch, productId]);

  const handleSelect = productId => {
    setProductId(productId);
  };

  return (
    <Card>
      <CardHeader title="Units Manager">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={customersUIProps.newCustomerButtonClick}
          >
            New Unit
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="col-md-6">
            <ProductsList
              entities={productEntities === null ? [] : productEntities}
              handleSelect={handleSelect}
            />
          </div>
          <div
            className="col-md-6"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >
            <CustomersTable
              entities={entities}
              totalCount={totalCount}
              listLoading={listLoading}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
