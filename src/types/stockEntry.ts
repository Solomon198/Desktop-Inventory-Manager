/* eslint-disable prettier/prettier */

export type StockEntryProperties = {
  _id: any;

  unit_id: any;

  quantity: string;
};

export type StockEntryTypes = {
  name: string;

  primaryKey: string;

  properties: StockEntryProperties;
};
