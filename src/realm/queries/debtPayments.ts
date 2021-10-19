import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
// import { DebtPaymentProperties } from "../../types/customer";
import { DebtPaymentProperties } from '../../types/debtPayment';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';

const app = RealmApp();

type getDebtPaymentsResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} DebtPayment
 * @property {ObjectId} customer_id - The customer ID that makes the debt payment transaction
 * @property {number} paid_amount - The total amount paid by the customer
 * @property {number} total_outstanding - The total amount left to be paid
 * @property {date} date - The date the transaction/payment is being made
 */

/**
 *
 * @typedef {Object} DebtPaymentsResponse
 * @property {number} totalCount - total record of debt payments
 * @property {Array}  entities - the list of paginated debt payments
 */

/**
 * @description Creating a new debt payment for the selected customer
 * @async
 * @function createDebtPayment
 * @param {DebtPayment} - Debt Payment to be created
 * @returns {Promise<DebtPayment>} The created debt payment
 */

function createDebtPayment(debtPayment: DebtPaymentProperties) {
  return new Promise<DebtPaymentProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let customerId = mongoose.Types.ObjectId(debtPayment.customer_id);

    debtPayment._id = id;
    debtPayment.customer_id = customerId;

    app.write(() => {
      try {
        let newDebtPayment: Realm.Object;
        newDebtPayment = app.create(
          Schemas.DebtPaymentSchema.name,
          debtPayment
        );
        newDebtPayment = newDebtPayment.toJSON();
        let debtPaymentObject: DebtPaymentProperties = newDebtPayment as any;
        debtPaymentObject._id = debtPaymentObject._id.toHexString();
        debtPaymentObject.customer_id = debtPaymentObject.customer_id.toHexString();
        debtPaymentObject.paid_amount = helperFuncs.transformToCurrencyString(
          debtPaymentObject.paid_amount
        );
        debtPaymentObject.prev_total_outstanding = helperFuncs.transformToCurrencyString(
          debtPaymentObject.prev_total_outstanding
        );
        debtPaymentObject.new_total_outstanding = helperFuncs.transformToCurrencyString(
          debtPaymentObject.new_total_outstanding
        );
        debtPaymentObject.date = helperFuncs.transformDateObjectToString(
          debtPaymentObject.date
        );
        resolve(debtPaymentObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

/**
 * @description Get Debt Payment by customer ID
 * @async
 * @function getDebtPaymentSync
 * @param  {string} customerId - The ID(identity) of the customer
 * @returns {Promise<DebtPayment>} Returns the Debt Payment
 */

function getDebtPaymentSync(customerId: string) {
  try {
    let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

    let debtPayment = app.objectForPrimaryKey(
      Schemas.DebtPaymentSchema.name,
      convertIdToObjectId as any
    );

    let debtPaymentObject: DebtPaymentProperties = debtPayment?.toJSON() as any;
    debtPaymentObject._id = debtPaymentObject._id.toHexString();
    debtPaymentObject.customer_id = debtPaymentObject.customer_id.toHexString();
    debtPaymentObject.paid_amount = helperFuncs.transformToCurrencyString(
      debtPaymentObject.paid_amount
    );
    debtPaymentObject.prev_total_outstanding = helperFuncs.transformToCurrencyString(
      debtPaymentObject.prev_total_outstanding
    );
    debtPaymentObject.new_total_outstanding = helperFuncs.transformToCurrencyString(
      debtPaymentObject.new_total_outstanding
    );
    debtPaymentObject.date = helperFuncs.transformDateObjectToString(
      debtPaymentObject.date
    );

    return debtPaymentObject as DebtPaymentProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get Debt Payment customer ID
 * @async
 * @function getDebtPayment
 * @param  {string} customerId - The ID(identity) of the customer
 * @returns {Promise<Customer>} Returns the Debt Payment
 */
function getDebtPayment(customerId: string) {
  return new Promise<DebtPaymentProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

      let debtPayment = app.objectForPrimaryKey(
        Schemas.DebtPaymentSchema.name,
        convertIdToObjectId as any
      );
      let debtPaymentObject: DebtPaymentProperties = debtPayment?.toJSON() as any;
      debtPaymentObject._id = debtPaymentObject._id.toHexString();
      debtPaymentObject.customer_id = debtPaymentObject.customer_id.toHexString();
      debtPaymentObject.paid_amount = helperFuncs.transformToCurrencyString(
        debtPaymentObject.paid_amount
      );
      debtPaymentObject.prev_total_outstanding = helperFuncs.transformToCurrencyString(
        debtPaymentObject.prev_total_outstanding
      );
      debtPaymentObject.new_total_outstanding = helperFuncs.transformToCurrencyString(
        debtPaymentObject.new_total_outstanding
      );
      // debtPaymentObject.date = helperFuncs.transformDateObjectToString(
      //   debtPaymentObject.date
      // );
      resolve(debtPaymentObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get Debt Payments by customer ID
 * @async
 * @function getCustomerDebtPaymentsHistory
 * @param  {string} customerId - The ID(identity) of the Customer
 * @returns {Promise<DebtPayment>} Returns the Customer's debts payment history
 */
function getCustomerDebtPaymentsHistory(
  pageNumber = 1,
  pageSize = 5,
  customerId
) {
  return new Promise<getDebtPaymentsResponse>((resolve, reject) => {
    mongoose.Types.ObjectId(customerId);
    try {
      let customerDebtPaymentsHistory: Realm.Results<Realm.Object>;
      let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

      customerDebtPaymentsHistory = app
        .objects(Schemas.DebtPaymentSchema.name)
        .filtered('customer_id = $0', convertIdToObjectId);

      let partition = helperFuncs.getPaginationPartition(pageNumber, pageSize);
      // let totalCount = customerDebtPaymentsHistory.length;
      let result = customerDebtPaymentsHistory.slice(
        partition.pageStart,
        partition.pageEnd
      );

      let objArr: any[] = [];

      result.forEach((obj) => {
        let newObj = obj.toJSON() as DebtPaymentProperties;
        newObj._id = newObj._id.toHexString();
        newObj.customer_id = newObj.customer_id.toHexString();
        newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
        newObj.paid_amount = helperFuncs.transformToCurrencyString(
          newObj.paid_amount
        );
        newObj.prev_total_outstanding = helperFuncs.transformToCurrencyString(
          newObj.prev_total_outstanding
        );
        newObj.new_total_outstanding = helperFuncs.transformToCurrencyString(
          newObj.new_total_outstanding
        );

        objArr.push(newObj);
      });
      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: objArr };

      resolve(response);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get all Debt Payments
 * @async
 * @function getDebtPayments
 * @param {number} [page=1] - The page number of the request for Debt Payments
 * @param {number} pageSize - The size of page
 * @returns {Promise<DebtPaymentsResponse>} returns the total debt payments count and entities
 */
function getDebtPayments(page = 1, pageSize = 10, searchQuery = '', type = '') {
  return new Promise<getDebtPaymentsResponse>((resolve, reject) => {
    try {
      let debtPayments: Realm.Results<Realm.Object>;

      debtPayments = app.objects(Schemas.DebtPaymentSchema.name).sorted('date');

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = debtPayments.length;
      let result = debtPayments.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj: DebtPaymentProperties = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        newObj.customer_id = newObj.customer_id.toHexString();
        newObj.paid_amount = helperFuncs.transformToCurrencyString(
          newObj.paid_amount
        );
        newObj.prev_total_outstanding = helperFuncs.transformToCurrencyString(
          newObj.prev_total_outstanding
        );
        newObj.new_total_outstanding = helperFuncs.transformToCurrencyString(
          newObj.new_total_outstanding
        );
        newObj.date = helperFuncs.transformDateObjectToString(newObj.date);

        objArr.push(newObj);
      });

      let response = { totalCount: totalCount, entities: objArr.reverse() };

      resolve(response);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Remove debt payments by id
 * @async
 * @function removeDebtPayment
 * @param  {string} debtPaymentId - The ID(identity) of the debt payment
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeDebtPayment(debtPaymentId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(debtPaymentId);
      app.write(() => {
        let debtPayment = app.objectForPrimaryKey(
          Schemas.DebtPaymentSchema.name,
          changeToObjectId as any
        );
        app.delete(debtPayment);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Remove debt payments by id
 * @async
 * @function removeDebtPayments
 * @param  {string[]} debtPaymentIds - The IDs(identities) of the debt payments
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeDebtPayments(debtPaymentIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      debtPaymentIds.forEach((id) => {
        changeToObjectIds.push(mongoose.Types.ObjectId(id));
      });

      app.write(() => {
        changeToObjectIds.forEach((id) => {
          let debtPayment = app.objectForPrimaryKey(
            Schemas.DebtPaymentSchema.name,
            id as any
          );
          app.delete(debtPayment);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Update Debt Payment information
 * @async
 * @function updateDebtPayment
 * @param  {...DebtPayment} debtPayment - the properties to be updated
 * @returns {Promise<Customer>} returns the updated debtPayment Object
 */
function updateDebtPayment(debtPaymentForEdit: DebtPaymentProperties) {
  let debtPayment = Object.assign({}, debtPaymentForEdit);
  debtPayment._id = mongoose.Types.ObjectId(debtPayment._id);
  return new Promise<DebtPaymentProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let debtPaymentUpdate = app.create(
          Schemas.DebtPaymentSchema.name,
          debtPayment,
          Realm.UpdateMode.Modified
        );
        let debtPaymentObject: DebtPaymentProperties = debtPaymentUpdate.toJSON();
        debtPaymentObject._id = debtPaymentObject._id.toHexString();
        debtPaymentObject.customer_id = debtPaymentObject.customer_id.toHexString();
        debtPaymentObject.paid_amount = helperFuncs.transformToCurrencyString(
          debtPaymentObject.paid_amount
        );
        debtPaymentObject.prev_total_outstanding = helperFuncs.transformToCurrencyString(
          debtPaymentObject.prev_total_outstanding
        );
        debtPaymentObject.new_total_outstanding = helperFuncs.transformToCurrencyString(
          debtPaymentObject.new_total_outstanding
        );
        debtPaymentObject.date = helperFuncs.transformDateObjectToString(
          debtPaymentObject.date
        );
        resolve(debtPaymentObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

export default {
  createDebtPayment,
  getDebtPayment,
  getCustomerDebtPaymentsHistory,
  getDebtPayments,
  removeDebtPayment,
  removeDebtPayments,
  updateDebtPayment,
  getDebtPaymentSync,
};
