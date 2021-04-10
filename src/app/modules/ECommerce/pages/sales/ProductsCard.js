import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";
import { ProductsFilter } from "./products-filter/ProductsFilter";
import { ProductsTable } from "./products-table/ProductsTable";
import { ProductsGrouping } from "./products-grouping/ProductsGrouping";
import { useSalesUIContext } from "./ProductsUIContext";

export function ProductsCard() {
  const salesUIContext = useSalesUIContext();
  const salesUIProps = useMemo(() => {
    return {
      ids: salesUIContext.ids,
      queryParams: salesUIContext.queryParams,
      setQueryParams: salesUIContext.setQueryParams,
      newSaleButtonClick: salesUIContext.newSaleButtonClick,
      openDeleteSalesDialog: salesUIContext.openDeleteSalesDialog,
      openEditSalePage: salesUIContext.openEditSalePage,
      openUpdateSalesStatusDialog: salesUIContext.openUpdateSalesStatusDialog,
      openFetchSalesDialog: salesUIContext.openFetchSalesDialog
    };
  }, [salesUIContext]);

  return (
    <Card>
      <CardHeader title="Sales list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={salesUIProps.newSaleButtonClick}
          >
            New Sale
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ProductsFilter />
        {salesUIProps.ids.length > 0 && (
          <>
            <ProductsGrouping />
          </>
        )}
        <ProductsTable />
      </CardBody>
    </Card>
  );
}
