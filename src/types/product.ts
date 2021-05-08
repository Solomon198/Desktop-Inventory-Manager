/* eslint-disable prettier/prettier */

export type ProductProperties = {
  _id: any;

  model: string;

  manufacturer: string;

  model_year: string;

  vin_code: string;

  description: string;

  // mileage: string;

  // color: string;

  // price: string;

  // status: string;

  // condition: string;
};

export type ProductTypes = {
  name: string;

  primaryKey: string;

  properties: ProductProperties;
};
