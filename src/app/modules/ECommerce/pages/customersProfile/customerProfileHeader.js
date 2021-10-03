import React from "react";
import {
  Card,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";

export function CustomerProfileHeader({ history, customer }) {
  if (!customer) return null;
  const backToPreviousPath = () => {
    // history.push("/e-commerce/customers");
    history.goBack();
  };
  return (
    <Card>
      <CardHeader title={`${customer.first_name}'s Profile`}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToPreviousPath}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Go Back
          </button>
        </CardHeaderToolbar>
      </CardHeader>
    </Card>
  );
}
