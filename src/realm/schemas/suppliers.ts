import { SupplierType } from '../../types/supplier';

const SupplierSchema: SupplierType = {
  name: 'suppliers',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    supplier_name: 'string?',

    address: 'string?',

    phone_no: 'string?',

    date: 'date',
  },
};

export default SupplierSchema;
