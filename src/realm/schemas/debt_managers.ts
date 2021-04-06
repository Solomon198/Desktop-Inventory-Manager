import { DebtManagerTypes } from '../../types/debtManager'; // typescript type validation for daily attendance

const DebtManagerSchema: DebtManagerTypes = {
  name: 'debtManagers',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    customer: 'string?',

    product: 'string?',

    debt_cost: 'int?',

    description: 'string?',

    date: 'string?',
  },
};

export default DebtManagerSchema;
