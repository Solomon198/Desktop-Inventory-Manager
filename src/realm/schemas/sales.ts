import { SaleTypes } from '../../types/sale'; // typescript type validation for daily attendance

const SaleSchema: SaleTypes = {
  name: 'sales',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    customer_id: 'objectId?',

    product_id: 'objectId?',

    total_amount: 'int?',

    transaction_type: 'string?',

    date: 'string?',
  },
};

export default SaleSchema;
