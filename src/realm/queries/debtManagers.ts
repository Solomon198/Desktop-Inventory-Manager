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

type transactionToUpdate = {
  _id: any;
  customer_id: any;
  amount: any;
};

/**
 * @typedef {Object} CustomerTransaction
 * @property {objectId} customer_id - ID of the customer
 * @property {number} total_amount - The total amount of sales paid by the customer
 * @property {number} total_outstanding - Total amount of outstanding to be paid by the customer
 */

/**
 * @typedef {Object} UpdateCustomerTransaction
 * @property {objectId} customer_id - ID of the customer
 * @property {number} amount - The amount of debt paid by the customer
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

      customerTransactions = app
        .objects(Schemas.DebtManagerSchema.name)
        .filtered("customer_id = $0", convertIdToObjectId);

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

/**
 * @description Updating a transaction for customer's sales and debts.
 * @async
 * @function updateCustomerTransaction
 * @param {UpdateCustomerTransaction} - Transaction to be updated
 * @returns {Promise<CustomerTransaction>} The created transaction
 */

function updateCustomerTransaction(customerTransaction: transactionToUpdate) {
  return new Promise<DebtManagerProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId(customerTransaction._id);
    let customerId = mongoose.Types.ObjectId(customerTransaction.customer_id);

    customerTransaction._id = id;
    customerTransaction.customer_id = customerId;
    customerTransaction.amount = helperFuncs.removeSymbolFromNumber(
      customerTransaction.amount
    );
    customerTransaction.amount = parseInt(customerTransaction.amount);

    app.write(() => {
      try {
        let getCustomerTransaction = app
          .objects(Schemas.DebtManagerSchema.name)
          .filtered("customer_id == $0", customerTransaction.customer_id);
        //run an update
        let objToUpdate: any = getCustomerTransaction[0];
        objToUpdate.total_amount += customerTransaction.amount;
        objToUpdate.total_outstanding -= customerTransaction.amount;
        let transactionObject: DebtManagerProperties = objToUpdate.toJSON() as any;

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
      } catch (e) {
        reject(e.message);
        console.log(e);
      }
    });
  });
}

export default {
  createCustomerTransaction,
  getCustomerTransaction,
  updateCustomerTransaction
};
