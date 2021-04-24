import { CustomerTypes } from '../../types/customer'; // typescript type validation for customers

const CustomerSchema: CustomerTypes = {
  name: 'customers',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    title: 'string?',

    first_name: 'string?',

    last_name: 'string?',

    display_name: 'string?',

    gender: 'string?',

    login: 'string?',

    email: 'string?',

    phone_no: 'string?',

    ip_address: 'string?',

    website: 'string?',

    cus_type: 'string?',
  },
};

export default CustomerSchema;
