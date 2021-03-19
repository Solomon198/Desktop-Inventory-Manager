/* eslint-disable prettier/prettier */

type ExpenseProperties = {
  _id: string;

  payee: string;

  payment_amount: string;

  payment_method: any;

  date: string;
};

export type ExpenseTypes = {
  name: string;

  primaryKey: string;

  properties: ExpenseProperties;
};
