import React from 'react';
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../_metronic/_partials/controls';

export function CustomerProfileHeader({ history, customer }) {
  if (!customer) return null;
  const backToCustomersList = () => {
    history.push('/e-commerce/customers');
  };
  return (
    <Card>
      <CardHeader title={`${customer.first_name}'s Profile`}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToCustomersList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
        </CardHeaderToolbar>
      </CardHeader>
    </Card>
  );
}
