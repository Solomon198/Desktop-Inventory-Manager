/* eslint-disable prettier/prettier */

export type UnitProperties = {
  _id: any;

  product_id: any;

  name: string;

  price: any;

  bulk_size?: any;

  product_name?: string;

  date: string;
};

export type UnitTypes = {
  name: string;

  primaryKey: string;

  properties: UnitProperties;
};
