/* eslint-disable prettier/prettier */

export type DebtManagerProperties = {
  _id: any;

  customer_id: any;

  product_id: any;

  employee_id: any;

  amount: string;

  description: string;

  date: string;
};

export type DebtManagerTypes = {
  name: string;

  primaryKey: string;

  properties: DebtManagerProperties;
};
