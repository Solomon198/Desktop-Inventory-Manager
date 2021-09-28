export type RoleProperties = {
  _id: any;

  role_name: string;

  date: string;
};

export type RoleTypes = {
  name: string;

  primaryKey: any;

  properties: RoleProperties;
};
