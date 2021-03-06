import { DebtPaymentTypes } from "../../types/debtPayment";

const DebtPaymentSchema: DebtPaymentTypes = {
  name: "debtPayments",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    customer_id: "objectId?",

    paid_amount: "double?",

    prev_total_outstanding: "double?",

    new_total_outstanding: "double?",

    date: "date?"
  }
};

export default DebtPaymentSchema;
