/* eslint-disable prettier/prettier */

export type ExpenseItemProperties = {
  _id: any;

  item: string;
};

export type ExpenseItemTypes = {
  name: string;

  primaryKey: string;

  properties: ExpenseItemProperties;
};
