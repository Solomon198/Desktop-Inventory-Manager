/* eslint-disable prettier/prettier */

type EmployeeProperties = {
  _id: string;

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
