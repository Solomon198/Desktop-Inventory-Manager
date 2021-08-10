import { SaleTypes } from "../../types/sale"; // typescript type validation for daily attendance

const SaleSchema: SaleTypes = {
  name: "sales",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    customer_id: "objectId?",

    products: "productForSale[]",

    total_amount: "double?",

    part_payment: "double?",

    outstanding: "double?",

    transaction_type: "string?",

    transaction_code: "string?",

    date: "date?"
  }
};

export default SaleSchema;
