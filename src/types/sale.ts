/* eslint-disable prettier/prettier */

export type SaleProperties = {
  _id: any;

  customer_id?: any;

  products: any;

  total_amount: any;

  transaction_type: string;

  transaction_code?: any;

  part_payment?: any;

  outstanding?: any;

  date: any;

  customer_name?: string;

  customer_phone?: string;
};

export type SaleTypes = {
  name: string;

  primaryKey: string;

  properties: SaleProperties;
};
