/* eslint-disable prettier/prettier */

export type SaleProperties = {
  _id: any;

  customer_id: any;

  product_id: any;

  total_amount: string;

  transaction_type: string;

  date: string;
};

export type SaleTypes = {
  name: string;

  primaryKey: string;

  properties: SaleProperties;
};
