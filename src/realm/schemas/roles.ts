import { RoleTypes } from '../../types/role';

const RoleSchema: RoleTypes = {
  name: 'roles',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    role_name: 'string',

    sales: '{}',

    // products: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // stocks: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // stocks_history: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // unit_manager: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // customers: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // employees: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // expenses: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // debts_manager: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // suppliers: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    // role_manager: {
    //   read: 'boolean?',
    //   write: 'boolean?',
    //   edit: 'boolean?',
    //   delete: 'boolean?',
    // },

    date: 'date',
  },
};

export default RoleSchema;
