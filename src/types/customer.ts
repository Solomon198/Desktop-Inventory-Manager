/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export type CustomerProperties = {
  _id: any;

  first_name: string;

  last_name: string;

  gender: string;

  email: string;

  phone_no: string;

  address: string;
};

export type CustomerTypes = {
  name: string;

  primaryKey: string;

  properties: CustomerProperties;
};
