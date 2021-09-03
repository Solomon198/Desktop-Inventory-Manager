import { DebtManagerTypes } from '../../types/debtManager'; // typescript type validation for daily attendance

const DebtManagerSchema: DebtManagerTypes = {
  name: 'debtManagers',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    customer_id: 'objectId?',

    total_amount: 'double?',

    total_outstanding: 'double?',

    date: 'date?',
  },
};

export default DebtManagerSchema;
