/* eslint-disable prettier/prettier */

export type ExpenseProperties = {
  _id: any;

  item: string;

  description: string;

  amount: string;

  date: string;
};

export type ExpenseTypes = {
  name: string;

  primaryKey: string;

  properties: ExpenseProperties;
};
