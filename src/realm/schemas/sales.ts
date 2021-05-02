import { SaleTypes } from "../../types/sale"; // typescript type validation for daily attendance

const SaleSchema: SaleTypes = {
  name: "sales",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    customer_id: "objectId?",

    products: "productForSale[]",

    total_amount: "int?",

    part_payment: "int?",

    outstanding: "int?",

    transaction_type: "string?",

    status: "string?",

    date: "date?"
  }
};

export default SaleSchema;
