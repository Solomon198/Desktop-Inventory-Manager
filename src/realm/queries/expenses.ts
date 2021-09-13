import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { ExpenseProperties } from '../../types/expense';
import { ExpenseItemProperties } from '../../types/expensesItem';
import helperFuncs from '../utils/helpers.func';
import ExpenseItemAPI from './expensesItem';
import Realm from 'realm';
import helpersFunc from '../utils/helpers.func';

const app = RealmApp();

type getExpensesResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Expense
 * @property {string} expense_item_id - ID of the Expense Item
 * @property {number} amount - Expense amount
 * @property {string} description - Expense description
 * @property {date} date - Expense creation date
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
    let expenseItemId = mongoose.Types.ObjectId(expense.expense_item_id);

    expense._id = id;
    expense.expense_item_id = expenseItemId;
    expense.amount = helpersFunc.removeSymbolFromNumber(expense.amount);
    expense.amount = helpersFunc.transformRealmStringToNumber(expense.amount);

    app.write(() => {
      try {
        let newExpense: Realm.Object;
        newExpense = app.create(Schemas.ExpenseSchema.name, expense);
        newExpense = newExpense.toJSON();
        let expenseObject: ExpenseProperties = newExpense as any;

        let expItemId = expenseObject.expense_item_id.toHexString();
        let expenseItem = ExpenseItemAPI.getExpenseItemSync(
          expItemId
        ) as ExpenseItemProperties;

        try {
          expenseObject.date = helperFuncs.transformDateObjectToString(
            expenseObject.date
          );
          expenseObject.amount = helperFuncs.transformToCurrencyString(
            expenseObject.amount
          );
        } catch (e) {}

        expenseObject.expense_item = expenseItem.item;
        expenseObject._id = expenseObject._id.toHexString();
        expenseObject.expense_item_id = expenseObject.expense_item_id.toHexString();

        resolve(expenseObject);
      } catch (e) {
        reject((e as any).message);
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
        convertIdToObjectId as mongoose.Types.ObjectId
      );
      let expenseObject: ExpenseProperties = expense?.toJSON() as any;
      expenseObject._id = expenseObject._id.toHexString();
      expenseObject.expense_item_id = expenseObject.expense_item_id.toHexString();

      try {
        expenseObject.amount = helperFuncs.transformToCurrencyString(
          expenseObject.amount
        );
        expenseObject.date = helperFuncs.transformDateObjectToString(
          expenseObject.date
        );
      } catch (e) {}

      let expenseItem = ExpenseItemAPI.getExpenseItemSync(
        expenseObject.expense_item_id
      ) as ExpenseItemProperties;
      expenseObject.expense_item = `${expenseItem.item}`;
      resolve(expenseObject);
    } catch (e) {
      reject((e as any).message);
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
function getExpenses(page = 1, pageSize = 10, searchQuery = '') {
  return new Promise<getExpensesResponse>((resolve, reject) => {
    try {
      let expenses: Realm.Results<Realm.Object>;
      if (searchQuery.trim()) {
        let query = 'expense_item CONTAINS[c] $0';
        expenses = app
          .objects(Schemas.ExpenseSchema.name)
          .filtered(query, searchQuery);
      } else {
        expenses = app.objects(Schemas.ExpenseSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = expenses.length;
      let result = expenses.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as ExpenseProperties;
        newObj._id = newObj._id.toHexString();
        newObj.expense_item_id = newObj.expense_item_id.toHexString();
        let expenseItem = ExpenseItemAPI.getExpenseItemSync(
          newObj.expense_item_id
        ) as ExpenseItemProperties;
        newObj.expense_item = expenseItem.item;
        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
          newObj.amount = helperFuncs.transformToCurrencyString(newObj.amount);
        } catch (e) {}
        objArr.push(newObj);
      });

      let response = { totalCount: totalCount, entities: objArr };

      resolve(response);
    } catch (e) {
      reject((e as any).message);
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
          changeToObjectId as mongoose.Types.ObjectId
        );
        app.delete(expense);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
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
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      expenseIds.forEach((id) => {
        changeToObjectIds.push(
          mongoose.Types.ObjectId(id) as mongoose.Types.ObjectId
        );
      });

      app.write(() => {
        changeToObjectIds.forEach((id) => {
          let expense = app.objectForPrimaryKey(Schemas.ExpenseSchema.name, id);
          app.delete(expense);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
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
  expense.expense_item_id = mongoose.Types.ObjectId(expense.expense_item_id);
  expense.amount = helpersFunc.removeSymbolFromNumber(expense.amount);
  expense.amount = helpersFunc.transformRealmStringToNumber(expense.amount);
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
        let expItemId = expenseObject.expense_item_id.toHexString();
        let expenseItem = ExpenseItemAPI.getExpenseItemSync(
          expItemId
        ) as ExpenseItemProperties;
        expenseObject.expense_item = expenseItem.item;
        try {
          expenseObject.date = helperFuncs.transformDateObjectToString(
            expenseObject.date
          );
          expenseObject.amount = helperFuncs.transformToCurrencyString(
            expenseObject.amount
          );
        } catch (e) {}
        resolve(expenseObject);
      } catch (e) {
        reject((e as any).message);
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
  updateExpense,
};
