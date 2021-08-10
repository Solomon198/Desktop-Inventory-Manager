/* eslint-disable prettier/prettier */

export type ProductProperties = {
  _id: any;

  product_name: string;

  manufacturer: string;

  description: string;
};

export type ProductTypes = {
  name: string;

  primaryKey: string;

  properties: ProductProperties;
};
