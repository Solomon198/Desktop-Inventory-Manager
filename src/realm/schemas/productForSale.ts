import { ProductForSale } from '../../types/productForSale'; // typescript type validation for daily attendance

const ProductForSaleSchema: ProductForSale = {
  name: 'productForSale',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    productId: 'objectId',

    unit_id: 'objectId',

    amount: 'int',

    product: 'string',

    unit: 'string',

    quantity: 'int',

    totalAmount: 'int',
  },
};

export default ProductForSaleSchema;
