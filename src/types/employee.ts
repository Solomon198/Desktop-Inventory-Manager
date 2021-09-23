/* eslint-disable prettier/prettier */

export type EmployeeProperties = {
  _id: any;

  first_name: string;

  last_name: string;

  gender: string;

  default_password: string;

  email: string;

  phone_no: string;

  home_address: string;

  role: string;

  date: string;
};

export type EmployeeTypes = {
  name: string;

  primaryKey: string;

  properties: EmployeeProperties;
};
