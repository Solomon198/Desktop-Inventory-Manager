import { ProductTypes } from '../../types/product'; // typescript type validation for daily attendance

const ProductSchema: ProductTypes = {
  name: 'products',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    product_name: 'string',

    manufacturer: 'string?',

    description: 'string?',
  },
};

export default ProductSchema;
