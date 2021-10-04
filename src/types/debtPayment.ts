export type DebtPaymentProperties = {
  _id: any;

  customer_id: any;

  paid_amount: string;

  total_outstanding: string;

  date: string;
};

export type DebtPaymentTypes = {
  name: string;

  primaryKey: string;

  properties: DebtPaymentProperties;
};
