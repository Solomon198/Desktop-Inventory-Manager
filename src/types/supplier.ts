/* eslint-disable prettier/prettier */

export type SupplierProperties = {
  _id: any;

  supplier_name: string;

  address: string;

  phone_no: string;
};

export type SupplierType = {
  name: string;

  primaryKey: string;

  properties: SupplierProperties;
};
