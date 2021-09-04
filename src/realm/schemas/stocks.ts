import { StockTypes } from "../../types/stock"; // typescript type validation for daily attendance

const StockSchema: StockTypes = {
  name: "stocks",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    product_id: "objectId",

    unit_id: "objectId",

    quantity: "int?",

    date: "date?"
  }
};

export default StockSchema;
