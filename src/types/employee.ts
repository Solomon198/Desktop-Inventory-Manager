/* eslint-disable prettier/prettier */

export type EmployeeProperties = {
  _id: any;

  title: string;

  first_name: string;

  last_name: string;

  gender: string;

  login: string;

  email: string;

  phone_no: string;

  home_address: string;

  role: string;
};

export type EmployeeTypes = {
  name: string;

  primaryKey: string;

  properties: EmployeeProperties;
};
