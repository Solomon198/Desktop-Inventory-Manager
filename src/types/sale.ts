/* eslint-disable prettier/prettier */

export type SaleProperties = {
  _id: any;

  customer_id?: any;

  products: any;

  total_amount: string;

  transaction_type: string;

  transaction_code?: string;

  part_payment?: any;

  outstanding?: string;

  date: string;

  customer_name?: string;

  customer_phone?: string;
};

export type SaleTypes = {
  name: string;

  primaryKey: string;

  properties: SaleProperties;
};
