import { RoleTypes } from '../../types/role';

const RoleSchema: RoleTypes = {
  name: 'roles',

  primaryKey: '_id',

  properties: {
    _id: 'objectId',

    role_name: 'string',

    date: 'date',
  },
};

export default RoleSchema;
