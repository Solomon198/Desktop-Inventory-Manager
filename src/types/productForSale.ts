/* eslint-disable prettier/prettier */

export type productForSaleProps = {
  _id: any;
  productId: any;
  unit: string;
  amount: string;
  quantity: string;
  totalAmount: string;
  product: string;
};

export type ProductForSale = {
  name: string;

  primaryKey: string;

  properties: productForSaleProps;
};
