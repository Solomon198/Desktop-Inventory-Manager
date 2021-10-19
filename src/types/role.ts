/* eslint-disable prettier/prettier */

type AccessLayer = {
  read?: boolean;
  write?: boolean;
  edit?: boolean;
  delete?: boolean;
};

export type RoleProperties = {
  _id: any;

  role_name: string;

  sales: {};

  // products?: any;

  // stocks?: any;

  // stocks_history?: any;

  // unit_manager?: any;

  // customers?: any;

  // employees?: any;

  // expenses?: any;

  // debts_manager?: any;

  // suppliers?: any;

  // role_manager?: any;

  date: string;
};

export type RoleTypes = {
  name: string;

  primaryKey: any;

  properties: RoleProperties;
};
