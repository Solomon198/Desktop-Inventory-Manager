/* eslint-disable prettier/prettier */

export type StockEntryProperties = {
  _id: any;

  unit_id: any;

  product_id: any;

  unit_name?: string;

  product_name?: string;

  quantity: any;
};

export type StockEntryTypes = {
  name: string;

  primaryKey: string;

  properties: StockEntryProperties;
};
