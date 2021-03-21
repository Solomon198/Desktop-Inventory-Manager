/* eslint-disable prettier/prettier */

type SaleProperties = {
  _id: string;

  transaction_id: string;

  customer: string;

  product: string;

  total_amount: string;

  transaction_type: string;

  date: string;
};

export type SaleTypes = {
  name: string;

  primaryKey: string;

  properties: SaleProperties;
};
