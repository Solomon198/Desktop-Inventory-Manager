import { ExpenseTypes } from '../../types/expense'; // typescript type validation for daily attendance

const ExpenseSchema: ExpenseTypes = {
  name: 'expenses',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    item: 'string?',

    description: 'string?',

    amount: 'int?',

    date: 'date',
  },
};

export default ExpenseSchema;
