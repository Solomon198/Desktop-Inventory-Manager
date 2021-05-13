/* eslint-disable prettier/prettier */

export type StockProperties = {
  _id: any;

  product_id: any;

  unit_id: any;

  product_name?: string;

  unit_name?: string;

  quantity: any;

  date: string;
};

export type StockTypes = {
  name: string;

  primaryKey: string;

  properties: StockProperties;
};
