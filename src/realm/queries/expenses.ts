import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { ExpenseProperties } from "../../types/expense";
import helperFuncs from "../utils/helpers.func";
import Realm from "realm";

const app = RealmApp();

type getExpensesResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Expense
 * @property {string} item - Expense item
 * @property {string} description - Expense description
 * @property {number} amount - Expense amount
 */

/**
 *
 * @typedef {Object} expensesResponse
 * @property {number} totalCount - total amount of expenses
 * @property {Array}  entities - the list of paginated expenses
 */

/**
 * @description Creating a new expense for the current organization
 * @async
 * @function createExpense
 * @param {Expense} - Expense to be created
 * @returns {Promise<Expense>} The created expense
 */

function createExpense(expense: ExpenseProperties) {
  return new Promise<ExpenseProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();

    expense._id = id;

    app.write(() => {
      try {
        let newExpense: Realm.Object;
        newExpense = app.create(Schemas.ExpenseSchema.name, expense);
        newExpense = newExpense.toJSON();
        let expenseObject: ExpenseProperties = newExpense as any;
        expenseObject._id = expenseObject._id.toHexString();

        try {
          expenseObject.date = helperFuncs.transformDateObjectToString(
            expenseObject.date
          );
        } catch (e) {}

        resolve(expenseObject);
      } catch (e) {
        console.log(e);
        reject(e.message);
      }
    });
  });
}

/**
 * @description Get expense by id
 * @async
 * @function getExpense
 * @param  {string} expenseId - The ID(identity) of the expense
 * @returns {Promise<Expense>} Returns the expense
 */
function getExpense(expenseId: string) {
  return new Promise<ExpenseProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(expenseId);

      let expense = app.objectForPrimaryKey(
        Schemas.ExpenseSchema.name,
        convertIdToObjectId as ObjectId
      );
      let expenseObject: ExpenseProperties = expense?.toJSON() as any;
      expenseObject._id = expenseObject._id.toHexString();
      resolve(expenseObject);
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Get expenses
 * @async
 * @function getExpenses
 * @param {number} [page=1] - The page number of the request for expenses
 * @param {number} pageSize - The size of page
 * @returns {Promise<expensesResponse>} returns the total expense count and entities
 */
function getExpenses(page = 1, pageSize = 10, searchQuery = "", type = "") {
  return new Promise<getExpensesResponse>((resolve, reject) => {
    try {
      let expenses: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1";
        expenses = app
          .objects(Schemas.ExpenseSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0";
        expenses = app
          .objects(Schemas.ExpenseSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = "cus_type == $0";
        expenses = app
          .objects(Schemas.ExpenseSchema.name)
          .filtered(query, type);
      } else {
        expenses = app.objects(Schemas.ExpenseSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = expenses.length;
      let result = expenses.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
          newObj.amount = helperFuncs.transformToCurrencyString(newObj.amount);
        } catch (e) {}
        objArr.push(newObj);
      });

      let response = { totalCount: totalCount, entities: objArr };

      resolve(response);
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Remove expense by id
 * @async
 * @function removeExpense
 * @param  {string} expenseId - The ID(identity) of the expense
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeExpense(expenseId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(expenseId);
      app.write(() => {
        let expense = app.objectForPrimaryKey(
          Schemas.ExpenseSchema.name,
          changeToObjectId as ObjectId
        );
        app.delete(expense);
        resolve(true);
      });
    } catch (e) {
      console.log(e);
      reject(e.message);
    }
  });
}

/**
 * @description Remove expense by id
 * @async
 * @function removeExpenses
 * @param  {string[]} expenseIds - The IDs(identities) of the expenses
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeExpenses(expenseIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: ObjectId[] = [];

      expenseIds.forEach(id => {
        changeToObjectIds.push(mongoose.Types.ObjectId(id) as ObjectId);
      });

      app.write(() => {
        changeToObjectIds.forEach(id => {
          let expense = app.objectForPrimaryKey(Schemas.ExpenseSchema.name, id);
          app.delete(expense);
        });

        resolve(true);
      });
    } catch (e) {
      console.log(e);
      reject(e.message);
    }
  });
}

/**
 * @description Update Expense information
 * @async
 * @function updateExpense
 * @param  {...Expense} expense - the properties to be updated
 * @returns {Promise<Expense>} returns the updated expense Object
 */
function updateExpense(expenseForEdit: ExpenseProperties) {
  let expense = Object.assign({}, expenseForEdit);
  expense._id = mongoose.Types.ObjectId(expense._id);
  return new Promise<ExpenseProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let expenseUpdate = app.create(
          Schemas.ExpenseSchema.name,
          expense,
          Realm.UpdateMode.Modified
        );
        let expenseObject: ExpenseProperties = expenseUpdate.toJSON();
        expenseObject._id = expenseObject._id.toHexString();
        try {
          expenseObject.date = helperFuncs.transformDateObjectToString(
            expenseObject.date
          );
        } catch (e) {}
        resolve(expenseObject);
      } catch (e) {
        reject(e.message);
      }
    });
  });
}

export default {
  createExpense,
  getExpense,
  getExpenses,
  removeExpense,
  removeExpenses,
  updateExpense
};
