/* eslint-disable prettier/prettier */

type CustomerProperties = {
  _id: 'objectId';

  title: string;

  first_name: string;

  last_name: string;

  display_name: string;

  gender: string;

  login: string;

  email: string;

  phone_no: string;

  ip_address: string;

  website: string;

  cus_type: string;
};

export type CustomerTypes = {
  name: string;

  primaryKey: string;

  properties: CustomerProperties;
};
