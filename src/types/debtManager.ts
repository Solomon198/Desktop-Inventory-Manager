/* eslint-disable prettier/prettier */

export type DebtManagerProperties = {
  _id: any;

  customer_id: any;

  total_amount: string;

  total_outstanding: string;

  date: string;
};

export type DebtManagerTypes = {
  name: string;

  primaryKey: string;

  properties: DebtManagerProperties;
};
