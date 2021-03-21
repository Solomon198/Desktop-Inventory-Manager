/* eslint-disable prettier/prettier */

import { ExpenseTypes } from '../../types/expense'; // typescript type validation for daily attendance

const ExpenseSchema: ExpenseTypes = {
  name: 'expenses',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    payee: 'string?',

    payment_amount: 'int?',

    payment_method: 'string[]',

    date: 'string?',
  },
};

export default ExpenseSchema;
