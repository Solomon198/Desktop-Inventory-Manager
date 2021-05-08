import { DebtManagerTypes } from "../../types/debtManager"; // typescript type validation for daily attendance

const DebtManagerSchema: DebtManagerTypes = {
  name: "debtManagers",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    customer_id: "string?",

    product_id: "objectId",

    employee_id: "objectId",

    amount: "int?",

    description: "string?",

    date: "string?"
  }
};

export default DebtManagerSchema;
