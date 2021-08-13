/* eslint-disable prettier/prettier */

export type SupplierProperties = {
  _id: any;

  supplier_name: string;

  address: string;

  phone_no: string;

  balance: any;
};

export type SupplierType = {
  name: string;

  primaryKey: string;

  properties: SupplierProperties;
};
