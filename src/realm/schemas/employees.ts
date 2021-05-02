import { EmployeeTypes } from "../../types/employee"; // typescript type validation for daily attendance

const EmployeeSchema: EmployeeTypes = {
  name: "employees",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    title: "string?",

    first_name: "string?",

    last_name: "string?",

    gender: "string?",

    login: "string?",

    email: "string?",

    phone_no: "string?",

    home_address: "string?",

    role: "string?"
  }
};

export default EmployeeSchema;
