import { ProductTypes } from '../../types/product'; // typescript type validation for daily attendance

const ProductSchema: ProductTypes = {
  name: 'products',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    model: 'string',

    manufacturer: 'string?',

    model_year: 'int?',

    vin_code: 'string?',

    description: 'string?',
  },
};

export default ProductSchema;
