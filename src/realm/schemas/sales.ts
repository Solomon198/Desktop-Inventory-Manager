/* eslint-disable prettier/prettier */

import { SaleTypes } from '../../types/sale'; // typescript type validation for daily attendance

const SaleSchema: SaleTypes = {
  name: 'sales',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    transaction_id: 'string?',

    customer: 'string?',

    product: 'string?',

    total_amount: 'int?',

    transaction_type: 'string?',

    date: 'string?',
  },
};

export default SaleSchema;
