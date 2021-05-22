import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";
import { CustomersFilter } from "./customers-filter/CustomersFilter";
import { CustomersTable } from "./customers-table/CustomersTable";
import { CustomersGrouping } from "./customers-grouping/CustomersGrouping";
import { useCustomersUIContext } from "./CustomersUIContext";

export function CustomersCard() {
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      id: customersUIContext.id,
      ids: customersUIContext.ids,
      newCustomerButtonClick: customersUIContext.newCustomerButtonClick,
      proceedToQuickSale: customersUIContext.proceedToQuickSale
    };
  }, [customersUIContext]);

  return (
    <Card>
      <CardHeader title="Select a customer">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={customersUIProps.newCustomerButtonClick}
          >
            New Customer
          </button>
          {/* {customersUIProps.id && ( */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={customersUIProps.proceedToQuickSale}
          >
            Quick Sale
          </button>
          {/* )} */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <CustomersFilter />
        {/* {customersUIProps.ids.length > 0 && <CustomersGrouping />} */}
        <CustomersTable />
      </CardBody>
    </Card>
  );
}
