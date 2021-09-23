import { EmployeeTypes } from '../../types/employee'; // typescript type validation for daily attendance

const EmployeeSchema: EmployeeTypes = {
  name: 'employees',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    first_name: 'string?',

    last_name: 'string?',

    gender: 'string?',

    default_password: 'string?',

    email: 'string?',

    phone_no: 'string?',

    home_address: 'string?',

    role: 'string?',

    date: 'date',
  },
};

export default EmployeeSchema;
