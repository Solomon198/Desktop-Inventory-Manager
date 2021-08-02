/* eslint-disable prettier/prettier */
export type DeveloperProperties = {
  _id: any;
  first_name: string;
  last_name: string;
  gender: string;
};

export type DeveloperTypes = {
  name: string;

  primaryKey: string;

  properties: DeveloperProperties;
};
