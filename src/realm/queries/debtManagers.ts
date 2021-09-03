import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { DebtManagerProperties } from "../../types/debtManager";
import { CustomerProperties } from "../../types/customer";
import helperFuncs from "../utils/helpers.func";
import Realm from "realm";
import CustomerAPI from "./customers";
import helpersFunc from "../utils/helpers.func";

const app = RealmApp();

type getStocksEntryResponse = {
  totalCount: number;
  entities: any[];
};

type decrementStockEntry = {
  unit_id: any;
  quantity: number;
};

/**
 * @typedef {Object} CustomerTransaction
 * @property {objectId} customer_id - ID of the customer
 * @property {number} total_amount - The total amount of sales paid by the customer
 * @property {number} total_outstanding - Total amount of outstanding to be paid by the customer
 */

/**
 *
 * @typedef {Object} stocksEntryResponse
 * @property {number} totalCount - total amount of stocks entry
 * @property {Array}  entities - the list of paginated stocks entry
 */

/**
 * @description Creating a new transaction for customer's sales and debts.
 * @async
 * @function createCustomerTransaction
 * @param {CustomerTransaction} - Transaction to be created
 * @returns {Promise<CustomerTransaction>} The created transaction
 */

function createCustomerTransaction(customerTransaction: DebtManagerProperties) {
  return new Promise<DebtManagerProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let customerId = mongoose.Types.ObjectId(customerTransaction.customer_id);

    customerTransaction._id = id;
    customerTransaction.customer_id = customerId;

    app.write(() => {
      try {
        let newTransaction: Realm.Object;
        let getCustomerTransaction = app
          .objects(Schemas.DebtManagerSchema.name)
          .filtered("customer_id == $0", customerTransaction.customer_id);
        if (getCustomerTransaction.length > 0) {
          //run an update
          let objToUpdate: any = getCustomerTransaction[0];
          objToUpdate.total_amount += customerTransaction.total_amount;
          objToUpdate.total_outstanding +=
            customerTransaction.total_outstanding;
          let transactionObject: DebtManagerProperties = objToUpdate.toJSON() as any;
          let cId = transactionObject.customer_id.toHexString();
          let customer = CustomerAPI.getCustomerSync(cId) as CustomerProperties;

          transactionObject._id = transactionObject._id.toHexString();
          transactionObject.customer_id = transactionObject.customer_id.toHexString();
          try {
            transactionObject.total_amount = helperFuncs.transformToCurrencyString(
              transactionObject.total_amount
            );
            transactionObject.total_outstanding = helperFuncs.transformToCurrencyString(
              transactionObject.total_outstanding
            );
            transactionObject.date = helperFuncs.transformDateObjectToString(
              transactionObject.date
            );
          } catch (e) {}
          resolve(transactionObject);
          console.log("First Transaction", transactionObject);
        } else {
          newTransaction = app.create(
            Schemas.DebtManagerSchema.name,
            customerTransaction
          );
          newTransaction = newTransaction.toJSON();

          let transactionObject: DebtManagerProperties = newTransaction as any;
          let cId = transactionObject.customer_id.toHexString();
          let customer = CustomerAPI.getCustomerSync(cId) as CustomerProperties;

          transactionObject._id = transactionObject._id.toHexString();
          transactionObject.customer_id = transactionObject.customer_id.toHexString();
          try {
            transactionObject.total_amount = helperFuncs.transformToCurrencyString(
              transactionObject.total_amount
            );
            transactionObject.total_outstanding = helperFuncs.transformToCurrencyString(
              transactionObject.total_outstanding
            );
            transactionObject.date = helperFuncs.transformDateObjectToString(
              transactionObject.date
            );
          } catch (e) {}
          resolve(transactionObject);
          console.log("Second Transaction", transactionObject);
        }
      } catch (e) {
        reject(e.message);
        console.log(e);
      }
    });
  });
}

/**
 * @description Get transaction by customer ID
 * @async
 * @function getCustomerTransaction
 * @param  {string} customerId - The ID(identity) of the Customer
 * @returns {Promise<CustomerTransaction>} Returns the Customer's sales and debts aggregates.
 */
function getCustomerTransaction(customerId: string) {
  console.log("CustomerID", customerId);
  return new Promise<any[]>((resolve, reject) => {
    try {
      let customerTransactions: Realm.Results<Realm.Object>;
      let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

      // let customerTransactions = app.objectForPrimaryKey(
      //   Schemas.DebtManagerSchema.name,
      //   convertIdToObjectId as ObjectId
      // );
      customerTransactions = app
        .objects(Schemas.DebtManagerSchema.name)
        .filtered("customer_id = $0", convertIdToObjectId);

      // let transactionObject: DebtManagerProperties = customerTransactions?.toJSON() as any;
      // transactionObject._id = transactionObject._id.toHexString();
      // transactionObject.customer_id = transactionObject.customer_id.toHexString();
      // let customer = CustomerAPI.getCustomerSync(
      //   transactionObject.customer_id
      // ) as CustomerProperties;
      // try {
      //   transactionObject.date = helperFuncs.transformDateObjectToString(
      //     transactionObject.date
      //   );
      // } catch (e) {}

      let objArr: any[] = [];

      customerTransactions.forEach(obj => {
        let newObj = obj.toJSON() as DebtManagerProperties;

        newObj._id = newObj._id.toHexString();
        newObj.customer_id = newObj.customer_id.toHexString();

        try {
          newObj.total_amount = helperFuncs.transformToCurrencyString(
            newObj.total_amount
          );
          newObj.total_outstanding = helperFuncs.transformToCurrencyString(
            newObj.total_outstanding
          );
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
        } catch (e) {}
        objArr.push(newObj);
      });

      resolve(objArr);
      console.log("Get transaction", objArr);
    } catch (e) {
      reject(e.message);
      console.log("Get Transaction Error", e);
    }
  });
}

// /**
//  * @description Get product quantity by unit ID
//  * @async
//  * @function getQuantityByUnitId
//  * @param  {string} unitId - The ID(identity) of the unit
//  * @returns {Promise<Stock>} Returns the total quantity of the unit
//  */
// function getQuantityByUnitId(unitId: string) {
//   return new Promise<getStocksEntryResponse>((resolve, reject) => {
//     try {
//       let stocks: Realm.Results<Realm.Object>;
//       let changeToObjectId = mongoose.Types.ObjectId(unitId);
//       // let convertIdToObjectId = mongoose.Types.ObjectId(stockId);

//       if (changeToObjectId) {
//         stocks = app
//           .objects(Schemas.StockEntrySchema.name)
//           .filtered('unit_id = $0', changeToObjectId);
//       } else {
//         return false;
//       }

//       let result = stocks.slice();

//       let objArr: any[] = [];

//       result.forEach((obj) => {
//         let newObj = obj.toJSON() as StockEntryProperties;
//         newObj._id = newObj._id.toHexString();
//         newObj.product_id = newObj.product_id.toHexString();
//         newObj.unit_id = newObj.unit_id.toHexString();
//         objArr.push(newObj);
//       });

//       let totalCount = objArr.length;

//       let response = { totalCount, entities: objArr };
//       resolve(response);
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Check if a product is out of stock
//  * @async
//  * @function isOutOfStocksEntry
//  * @param  {{unit_id: string, quantity: number}} stocksEntry - unit ID and quantity
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function isOutOfStocksEntry(stocksEntry: {
//   unit_id: string;
//   quantity: number;
// }) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       // let stock: Realm.Results<Realm.Object>;
//       let stock;
//       let changeToObjectId = mongoose.Types.ObjectId(stocksEntry.unit_id);

//       if (changeToObjectId) {
//         app.write(() => {
//           stock = app
//             .objects(Schemas.StockEntrySchema.name)
//             .filtered('unit_id = $0', changeToObjectId);
//         });
//       } else {
//         return false;
//       }

//       if (stock.length > 0) {
//         let getStockEntryObj = stock[0];

//         if (getStockEntryObj.quantity < stocksEntry.quantity) resolve(true);
//         resolve(false);
//       }
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description increment stock by a specified unitID and number of quanties
//  * @async
//  * @function incrementStockEntry
//  * @param  {Object} stocksEntry - unit IDs and quantities
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function incrementStockEntry(stockEntry: decrementStockEntry) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       let stock;

//       const unitId = mongoose.Types.ObjectId(stockEntry.unit_id);
//       stockEntry.unit_id = unitId;

//       if (stockEntry) {
//         app.write(() => {
//           stock = app
//             .objects(Schemas.StockEntrySchema.name)
//             .filtered('unit_id = $0', stockEntry.unit_id);
//           stock[0].quantity += stockEntry.quantity;
//         });
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description decrement stock by a specified unitID and number of quanties
//  * @async
//  * @function decrementStockEntry
//  * @param  {Object} stocksEntry - unit IDs and quantities
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function decrementStockEntry(stockEntry: decrementStockEntry) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       let stock;

//       const unitId = mongoose.Types.ObjectId(stockEntry.unit_id);
//       stockEntry.unit_id = unitId;

//       if (stockEntry) {
//         app.write(() => {
//           stock = app
//             .objects(Schemas.StockEntrySchema.name)
//             .filtered('unit_id = $0', stockEntry.unit_id);
//           stock[0].quantity -= stockEntry.quantity;
//         });
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Get unit ID and quantity for a products
//  * @async
//  * @function decrementStocksEntry
//  * @param  {any[]} stocksEntry - unit IDs and quantities
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function decrementStocksEntry(stocksEntry: any[]) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       // let stocks: Realm.Results<Realm.Object>;
//       let stocks;
//       let stocksEntryArr: any[] = [];

//       stocksEntry.forEach((val) => {
//         stocksEntryArr.push({
//           unit_id: mongoose.Types.ObjectId(val.unit_id) as any,
//           quantity: val.quantity,
//         });
//       });

//       if (stocksEntryArr) {
//         app.write(() => {
//           stocksEntryArr.forEach((valz) => {
//             stocks = app
//               .objects(Schemas.StockEntrySchema.name)
//               .filtered('unit_id = $0', valz.unit_id);
//             stocks[0].quantity -= valz.quantity;
//           });
//         });
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Get stocks entries for unit quantities
// //  * @async
//  * @function getStocksEntryForUnitQuatity
//  * @param {number} [page=1] - The page number of the request for stocks entries for unit quantities
//  * @param {number} pageSize - The size of page
//  * @returns {Promise<stocksEntryResponse>} returns the total stock entry for unit quantities count and entities
// //  */
// function getStocksEntryForUnitQuatity(
//   page = 1,
//   pageSize = 10,
//   searchQuery = '',
//   type = '',
//   unitId
// ) {
//   return new Promise<getStocksEntryResponse>((resolve, reject) => {
//     try {
//       let stocks: Realm.Results<Realm.Object>;
//       if (searchQuery.trim() && type.trim()) {
//         let query =
//           'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
//         stocks = app
//           .objects(Schemas.StockEntrySchema.name)
//           .filtered(query, searchQuery, type);
//       } else if (searchQuery.trim() && !type.trim()) {
//         let query =
//           'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
//         stocks = app
//           .objects(Schemas.StockEntrySchema.name)
//           .filtered(query, searchQuery);
//       } else if (!searchQuery.trim() && type.trim()) {
//         let query = 'cus_type == $0';
//         stocks = app
//           .objects(Schemas.StockEntrySchema.name)
//           .filtered(query, type);
//       } else {
//         stocks = app.objects(Schemas.StockEntrySchema.name);
//       }

//       let partition = helperFuncs.getPaginationPartition(page, pageSize);
//       // let totalCount = stocks.length;
//       let result = stocks.slice(partition.pageStart, partition.pageEnd);

//       let objArr: any[] = [];
//       //converting to array of Object
//       result.forEach((obj) => {
//         let newObj = obj.toJSON() as StockEntryProperties;
//         let unitId = newObj.unit_id.toHexString();
//         let unit = UnitAPI.getUnitSync(unitId) as UnitProperties;
//         newObj._id = newObj._id.toHexString();
//         newObj.unit_name = unit.name;
//         try {
//           newObj.quantity = newObj.quantity.toString();
//         } catch (e) {}
//         objArr.push(newObj);
//       });

//       let totalCount = objArr.length;

//       let response = { totalCount: totalCount, entities: objArr };

//       resolve(response);
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Get stocks entries
// //  * @async
//  * @function getStocksEntry
//  * @param {number} [page=1] - The page number of the request for stocks entries
//  * @param {number} pageSize - The size of page
//  * @returns {Promise<stocksEntryResponse>} returns the total stock entry count and entities
// //  */
// function getStocksEntry(page = 1, pageSize = 10, searchQuery = '', type = '') {
//   return new Promise<getStocksEntryResponse>((resolve, reject) => {
//     try {
//       let stocks: Realm.Results<Realm.Object>;
//       if (searchQuery.trim() && type.trim()) {
//         let query =
//           'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
//         stocks = app
//           .objects(Schemas.StockEntrySchema.name)
//           .filtered(query, searchQuery, type);
//       } else if (searchQuery.trim() && !type.trim()) {
//         let query =
//           'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
//         stocks = app
//           .objects(Schemas.StockEntrySchema.name)
//           .filtered(query, searchQuery);
//       } else if (!searchQuery.trim() && type.trim()) {
//         let query = 'cus_type == $0';
//         stocks = app
//           .objects(Schemas.StockEntrySchema.name)
//           .filtered(query, type);
//       } else {
//         stocks = app.objects(Schemas.StockEntrySchema.name);
//       }

//       let partition = helperFuncs.getPaginationPartition(page, pageSize);
//       // let totalCount = stocks.length;
//       let result = stocks.slice(partition.pageStart, partition.pageEnd);

//       let objArr: any[] = [];
//       //converting to array of Object
//       result.forEach((obj) => {
//         let newObj = obj.toJSON() as StockEntryProperties;
//         let unitId = newObj.unit_id.toHexString();
//         let unit = UnitAPI.getUnitSync(unitId) as UnitProperties;
//         let prodId = newObj.product_id.toHexString();
//         let product = ProductAPI.getProductSync(prodId) as ProductProperties;
//         newObj._id = newObj._id.toHexString();
//         newObj.unit_name = unit.name;
//         newObj.product_name = product.product_name;
//         try {
//           newObj.quantity = newObj.quantity.toString();
//           newObj.unit_name = helperFuncs.transformStringToUpperCase(
//             newObj.unit_name
//           );
//         } catch (e) {}
//         objArr.push(newObj);
//       });

//       let totalCount = objArr.length;
//       let response = { totalCount: totalCount, entities: objArr };

//       resolve(response);
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Remove stock entry by id
//  * @async
//  * @function removeStockEntry
//  * @param  {string} stockId - The ID(identity) of the stock entry
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function removeStockEntry(stockId: string) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       let changeToObjectId = mongoose.Types.ObjectId(stockId);
//       app.write(() => {
//         let stock = app.objectForPrimaryKey(
//           Schemas.StockEntrySchema.name,
//           changeToObjectId as ObjectId
//         );
//         app.delete(stock);
//         resolve(true);
//       });
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Remove stocks entries by id
//  * @async
//  * @function removeStocksEntry
//  * @param  {string[]} stockIds - The IDs(identities) of the stocks entry
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function removeStocksEntry(stockIds: string[]) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       let changeToObjectIds: ObjectId[] = [];

//       stockIds.forEach((id) => {
//         changeToObjectIds.push(mongoose.Types.ObjectId(id) as ObjectId);
//       });

//       app.write(() => {
//         changeToObjectIds.forEach((id) => {
//           let stock = app.objectForPrimaryKey(
//             Schemas.StockEntrySchema.name,
//             id
//           );
//           app.delete(stock);
//         });

//         resolve(true);
//       });
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Update Stock entry information
//  * @async
//  * @function updateStockEntry
//  * @param  {...Stock} stock - the properties to be updated
//  * @returns {Promise<Stock>} returns the updated stock entry Object
//  */
// function updateStockEntry(stockForEdit: StockEntryProperties) {
//   let stock = Object.assign({}, stockForEdit);
//   stock._id = mongoose.Types.ObjectId(stock._id);
//   return new Promise<StockEntryProperties>((resolve, reject) => {
//     app.write(() => {
//       try {
//         let stockUpdate = app.create(
//           Schemas.StockEntrySchema.name,
//           stock,
//           Realm.UpdateMode.Modified
//         );
//         let stockObject: StockEntryProperties = stockUpdate.toJSON();
//         stockObject._id = stockObject._id.toHexString();
//         resolve(stockObject);
//       } catch (e) {
//         reject(e.message);
//       }
//     });
//   });
// }

export default {
  createCustomerTransaction,
  getCustomerTransaction
  // getStocksEntry,
  // getQuantityByUnitId,
  // getStocksEntryForUnitQuatity,
  // isOutOfStocksEntry,
  // incrementStockEntry,
  // decrementStockEntry,
  // decrementStocksEntry,
  // removeStockEntry,
  // removeStocksEntry,
  // updateStockEntry,
};
