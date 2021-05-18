/* eslint-disable prettier/prettier */

export type productForSaleProps = {
  _id: any;
  productId: any;
  unit_id: any;
  amount: string;
  quantity: string;
  totalAmount: string;
  product: string;
  unit: string;
};

export type ProductForSale = {
  name: string;

  primaryKey: string;

  properties: productForSaleProps;
};
