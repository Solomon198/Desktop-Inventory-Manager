import { CustomerTypes } from "../../types/customer"; // typescript type validation for customers

const CustomerSchema: CustomerTypes = {
  name: "customers",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    first_name: "string?",

    last_name: "string?",

    gender: "string?",

    email: "string?",

    phone_no: "string?",

    address: "string?"
  }
};

export default CustomerSchema;
