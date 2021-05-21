import { ExpenseItemTypes } from "../../types/expensesItem"; // typescript type validation for daily attendance

const ExpenseItemSchema: ExpenseItemTypes = {
  name: "expensesItem",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    item: "string?"
  }
};

export default ExpenseItemSchema;
