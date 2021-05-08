/* eslint-disable prettier/prettier */

export type UnitProperties = {
  _id: any;

  product_id: any;

  name: string;

  price: any;

  product_name?: string;
};

export type UnitTypes = {
  name: string;

  primaryKey: string;

  properties: UnitProperties;
};
