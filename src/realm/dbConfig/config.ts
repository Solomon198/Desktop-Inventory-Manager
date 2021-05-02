import Realm from "realm";
import Schemas from "../schemas/index";

let APPLICATION: Realm;

export default function RealmApp() {
  if (!APPLICATION) {
    APPLICATION = new Realm({
      schema: [
        Schemas.CustomerSchema,
        Schemas.ProductSchema,
        Schemas.StockSchema,
        Schemas.SaleSchema,
        Schemas.ExpenseSchema,
        Schemas.EmployeeSchema,
        Schemas.DebtManagerSchema,
        Schemas.ProductForSaleSchema
      ]
    });
    return APPLICATION;
  } else {
    console.log("runing");
    return APPLICATION;
  }
}
