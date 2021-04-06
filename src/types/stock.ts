/* eslint-disable prettier/prettier */

type StockProperties = {
  _id: any;

  product: string;

  quantity: string;

  amount_per_item: string;

  stock_type: string;

  date: string;
};

export type StockTypes = {
  name: string;

  primaryKey: string;

  properties: StockProperties;
};
