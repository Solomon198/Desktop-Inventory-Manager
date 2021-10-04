import Realm from 'realm';
import Schemas from '../schemas/index';

let APPLICATION: Realm;

export default function RealmApp() {
  if (!APPLICATION) {
    APPLICATION = new Realm({
      schema: [
        Schemas.CustomerSchema,
        Schemas.ProductSchema,
        Schemas.StockSchema,
        Schemas.StockEntrySchema,
        Schemas.SaleSchema,
        Schemas.ExpenseSchema,
        Schemas.ExpenseItemSchema,
        Schemas.EmployeeSchema,
        Schemas.DebtManagerSchema,
        Schemas.DebtPaymentSchema,
        Schemas.ProductForSaleSchema,
        Schemas.UnitSchema,
        Schemas.SupplierSchema,
        Schemas.RoleSchema,
      ],
    });
    return APPLICATION;
  } else {
    console.log('runing');
    return APPLICATION;
  }
}
