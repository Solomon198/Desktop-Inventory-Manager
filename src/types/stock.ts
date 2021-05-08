/* eslint-disable prettier/prettier */

export type StockProperties = {
  _id: any;

  product_id: any;

  unit_id: any;

  quantity: string;

  date: string;
};

export type StockTypes = {
  name: string;

  primaryKey: string;

  properties: StockProperties;
};
