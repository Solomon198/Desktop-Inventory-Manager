/* eslint-disable prettier/prettier */

type ProductProperties = {
  _id: string;

  model: string;

  manufacturer: string;

  model_year: string;

  mileage: string;

  color: string;

  price: string;

  vin_code: string;

  status: string;

  condition: string;

  description: string;
};

export type ProductTypes = {
  name: string;

  primaryKey: string;

  properties: ProductProperties;
};
