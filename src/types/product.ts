/* eslint-disable prettier/prettier */

export type ProductProperties = {
  _id: any;

  product_name: string;

  supplier_id?: any;

  supplier_name?: string;

  description: string;

  date: string;
};

export type ProductTypes = {
  name: string;

  primaryKey: string;

  properties: ProductProperties;
};
