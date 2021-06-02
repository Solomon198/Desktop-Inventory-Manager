import { StockEntryTypes } from '../../types/stockEntry';

const StockEntrySchema: StockEntryTypes = {
  name: 'stocksEntry',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    unit_id: 'objectId',

    product_id: 'objectId',

    quantity: 'int?',
  },
};

export default StockEntrySchema;
