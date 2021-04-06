/* eslint-disable prettier/prettier */

type DebtManagerProperties = {
  _id: any;

  customer: string;

  product: string;

  debt_cost: string;

  description: string;

  date: string;
};

export type DebtManagerTypes = {
  name: string;

  primaryKey: string;

  properties: DebtManagerProperties;
};
