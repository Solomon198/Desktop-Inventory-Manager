import { ExpenseTypes } from '../../types/expense'; // typescript type validation for daily attendance

const ExpenseSchema: ExpenseTypes = {
  name: 'expenses',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    expense_item_id: 'objectId',

    amount: 'int?',

    description: 'string?',

    date: 'date',
  },
};

export default ExpenseSchema;
