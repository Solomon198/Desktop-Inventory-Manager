import { StockTypes } from "../../types/stock"; // typescript type validation for daily attendance

const StockSchema: StockTypes = {
  name: "stocks",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    product: "string?",

    quantity: "int?",

    amount_per_item: "int?",

    stock_type: "string?",

    date: "string?"
  }
};

export default StockSchema;
