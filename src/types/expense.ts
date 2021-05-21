/* eslint-disable prettier/prettier */

export type ExpenseProperties = {
  _id: any;

  expense_item_id: any;

  expense_item?: string;

  amount: any;

  description: string;

  date: string;
};

export type ExpenseTypes = {
  name: string;

  primaryKey: string;

  properties: ExpenseProperties;
};
