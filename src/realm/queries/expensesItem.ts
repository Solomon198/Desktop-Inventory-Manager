import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { ExpenseItemProperties } from "../../types/expensesItem";
import helperFuncs from "../utils/helpers.func";
import Realm from "realm";
// import { ExpenseProperties } from "../../types/expense";

const app = RealmApp();

type getExpensesItemResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} ExpenseItem
 * @property {string} item - Expense item
 */

/**
 *
 * @typedef {Object} expensesItemResponse
 * @property {number} totalCount - total amount of expenses item
 * @property {Array}  entities - the list of paginated expenses item
 */

/**
 * @description Creating a new expense item for the current organization
 * @async
 * @function createExpenseItem
 * @param {ExpenseItem} - Expense item to be created
 * @returns {Promise<ExpenseItem>} The created expense item
 */

function createExpenseItem(expenseItem: ExpenseItemProperties) {
  return new Promise<ExpenseItemProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();

    expenseItem._id = id;

    app.write(() => {
      try {
        let newExpenseItem: Realm.Object;
        newExpenseItem = app.create(
          Schemas.ExpenseItemSchema.name,
          expenseItem
        );
        newExpenseItem = newExpenseItem.toJSON();
        let expenseItemObject: ExpenseItemProperties = newExpenseItem as any;
        expenseItemObject._id = expenseItemObject._id.toHexString();

        resolve(expenseItemObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

/**
 * @description Get expense item by id
 * @async
 * @function getExpenseItemSync
 * @param  {string} expenseItemId - The ID(identity) of the expense item
 * @returns {Promise<ExpenseItem>} Returns the expense item
 */
function getExpenseItemSync(expenseItemId: string) {
  try {
    let convertIdToObjectId = mongoose.Types.ObjectId(expenseItemId);

    let expenseItem = app.objectForPrimaryKey(
      Schemas.ExpenseItemSchema.name,
      convertIdToObjectId as any
    );
    let expenseItemObject: ExpenseItemProperties = expenseItem?.toJSON() as any;
    expenseItemObject._id = expenseItemObject._id.toHexString();
    return expenseItemObject as ExpenseItemProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get expense item by id
 * @async
 * @function getExpenseItem
 * @param  {string} expenseItemId - The ID(identity) of the expense item
 * @returns {Promise<ExpenseItem>} Returns the expense item
 */
function getExpenseItem(expenseItemId: string) {
  return new Promise<ExpenseItemProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(expenseItemId);

      let expenseItem = app.objectForPrimaryKey(
        Schemas.ExpenseItemSchema.name,
        convertIdToObjectId as any
      );
      let expenseItemObject: ExpenseItemProperties = expenseItem?.toJSON() as any;
      expenseItemObject._id = expenseItemObject._id.toHexString();
      resolve(expenseItemObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get expenses item
 * @async
 * @function getExpensesItem
 * @param {number} [page=1] - The page number of the request for expenses item
 * @param {number} pageSize - The size of page
 * @returns {Promise<expensesItemResponse>} returns the total expense item count and entities
 */
function getExpensesItem(page = 1, pageSize = 10, searchQuery = "", type = "") {
  return new Promise<getExpensesItemResponse>((resolve, reject) => {
    try {
      let expensesItem: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1";
        expensesItem = app
          .objects(Schemas.ExpenseItemSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0";
        expensesItem = app
          .objects(Schemas.ExpenseItemSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = "cus_type == $0";
        expensesItem = app
          .objects(Schemas.ExpenseItemSchema.name)
          .filtered(query, type);
      } else {
        expensesItem = app.objects(Schemas.ExpenseItemSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = expensesItem.length;
      let result = expensesItem.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj = obj.toJSON();
        newObj._id = newObj._id.toHexString();
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
 * @description Remove expense item by id
 * @async
 * @function removeExpenseItem
 * @param  {string} expenseItemId - The ID(identity) of the expense item
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeExpenseItem(expenseItemId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(expenseItemId);
      app.write(() => {
        let expenseItem = app.objectForPrimaryKey(
          Schemas.ExpenseItemSchema.name,
          changeToObjectId as any
        );
        app.delete(expenseItem);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Remove expense item by id
 * @async
 * @function removeExpensesItem
 * @param  {string[]} expenseItemIds - The IDs(identities) of the expenses item
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeExpensesItem(expenseItemIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      expenseItemIds.forEach(id => {
        changeToObjectIds.push(
          mongoose.Types.ObjectId(id) as mongoose.Types.ObjectId
        );
      });

      app.write(() => {
        changeToObjectIds.forEach(id => {
          let expenseItem = app.objectForPrimaryKey(
            Schemas.ExpenseItemSchema.name,
            id as any
          );
          app.delete(expenseItem);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Update Expense item information
 * @async
 * @function updateExpenseItem
 * @param  {...ExpenseItem} expenseItem - the properties to be updated
 * @returns {Promise<ExpenseItem>} returns the updated expense item Object
 */
function updateExpenseItem(expenseForEdit: ExpenseItemProperties) {
  let expenseItem = Object.assign({}, expenseForEdit);
  expenseItem._id = mongoose.Types.ObjectId(expenseItem._id);
  return new Promise<ExpenseItemProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let expenseItemUpdate = app.create(
          Schemas.ExpenseItemSchema.name,
          expenseItem,
          Realm.UpdateMode.Modified
        );
        let expenseItemObject: ExpenseItemProperties = expenseItemUpdate.toJSON();
        expenseItemObject._id = expenseItemObject._id.toHexString();
        resolve(expenseItemObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

export default {
  createExpenseItem,
  getExpenseItemSync,
  getExpenseItem,
  getExpensesItem,
  removeExpenseItem,
  removeExpensesItem,
  updateExpenseItem
};
