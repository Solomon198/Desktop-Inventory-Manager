import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { CustomerProperties } from "../../types/customer";
import helperFuncs from "../utils/helpers.func";
import Realm from "realm";

const app = RealmApp();

type getCustomersResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Customer
 * @property {string} first_name - The customer first name
 * @property {string} last_name - The customer last name
 * @property {string} gender - The gender or sex of customer e.g male or female
 * @property {string} email - email of the customer
 * @property {string} phone_no - phone number of the customer
 */

/**
 *
 * @typedef {Object} customersResponse
 * @property {number} totalCount - total amount of customers
 * @property {Array}  entities - the list of paginated customers
 */

/**
 * @description Creating a new customer for the current organization
 * @async
 * @function createCustomer
 * @param {Customer} - Customer to be created
 * @returns {Promise<Customer>} The created customer
 */

function createCustomer(customer: CustomerProperties) {
  return new Promise<CustomerProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();

    customer._id = id;

    app.write(() => {
      try {
        let newCustomer: Realm.Object;
        newCustomer = app.create(Schemas.CustomerSchema.name, customer);
        newCustomer = newCustomer.toJSON();
        let customerObject: CustomerProperties = newCustomer as any;
        customerObject._id = customerObject._id.toHexString();
        customerObject.date = helperFuncs.transformDateObjectToString(
          customerObject.date
        );
        resolve(customerObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

/**
 * @description Get customer by id
 * @async
 * @function getCustomer
 * @param  {string} customerId - The ID(identity) of the customer
 * @returns {Promise<Customer>} Returns the customer
 */

function getCustomerSync(customerId: string) {
  try {
    let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

    let customer = app.objectForPrimaryKey(
      Schemas.CustomerSchema.name,
      convertIdToObjectId as ObjectId
    );

    let customerObject: CustomerProperties = customer?.toJSON() as any;
    customerObject._id = customerObject._id.toHexString();
    customerObject.date = helperFuncs.transformDateObjectToString(
      customerObject.date
    );

    return customerObject as CustomerProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get customer by id
 * @async
 * @function getCustomer
 * @param  {string} customerId - The ID(identity) of the customer
 * @returns {Promise<Customer>} Returns the customer
 */
function getCustomer(customerId: string) {
  return new Promise<CustomerProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

      let customer = app.objectForPrimaryKey(
        Schemas.CustomerSchema.name,
        convertIdToObjectId as ObjectId
      );
      let customerObject: CustomerProperties = customer?.toJSON() as any;
      customerObject._id = customerObject._id.toHexString();
      // customerObject.date = helperFuncs.transformDateObjectToString(
      //   customerObject.date
      // );
      resolve(customerObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get customers
 * @async
 * @function getCustomers
 * @param {number} [page=1] - The page number of the request for customers
 * @param {number} pageSize - The size of page
 * @returns {Promise<customersResponse>} returns the total customer count and entities
 */
function getCustomers(page = 1, pageSize = 10, searchQuery = "", type = "") {
  return new Promise<getCustomersResponse>((resolve, reject) => {
    try {
      let customers: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || gender CONTAINS[c] $0 && cus_type == $1";
        customers = app
          .objects(Schemas.CustomerSchema.name)
          .filtered(query, searchQuery, type)
          .sorted("date");
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || gender CONTAINS[c] $0";
        customers = app
          .objects(Schemas.CustomerSchema.name)
          .filtered(query, searchQuery)
          .sorted("date");
      } else if (!searchQuery.trim() && type.trim()) {
        let query = "cus_type == $0";
        customers = app
          .objects(Schemas.CustomerSchema.name)
          .filtered(query, type)
          .sorted("date");
      } else {
        customers = app.objects(Schemas.CustomerSchema.name).sorted("date");
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = customers.length;
      let result = customers.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj: CustomerProperties = obj.toJSON();
        newObj._id = newObj._id.toHexString();
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
 * @description Remove customer by id
 * @async
 * @function removeCustomer
 * @param  {string} customerId - The ID(identity) of the customer
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeCustomer(customerId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(customerId);
      app.write(() => {
        let customer = app.objectForPrimaryKey(
          Schemas.CustomerSchema.name,
          changeToObjectId as ObjectId
        );
        app.delete(customer);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Remove customer by id
 * @async
 * @function removeCustomers
 * @param  {string[]} customerIds - The IDs(identities) of the customers
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeCustomers(customerIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      customerIds.forEach(id => {
        changeToObjectIds.push(mongoose.Types.ObjectId(id));
      });

      app.write(() => {
        changeToObjectIds.forEach(id => {
          let customer = app.objectForPrimaryKey(
            Schemas.CustomerSchema.name,
            id as ObjectId
          );
          app.delete(customer);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Update Customer information
 * @async
 * @function updateCustomer
 * @param  {...Customer} customer - the properties to be updated
 * @returns {Promise<Customer>} returns the updated customer Object
 */
function updateCustomer(customerForEdit: CustomerProperties) {
  let customer = Object.assign({}, customerForEdit);
  customer._id = mongoose.Types.ObjectId(customer._id);
  return new Promise<CustomerProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let customerUpdate = app.create(
          Schemas.CustomerSchema.name,
          customer,
          Realm.UpdateMode.Modified
        );
        let customerObject: CustomerProperties = customerUpdate.toJSON();
        customerObject._id = customerObject._id.toHexString();
        customerObject.date = helperFuncs.transformDateObjectToString(
          customerObject.date
        );
        resolve(customerObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

export default {
  createCustomer,
  getCustomer,
  getCustomers,
  removeCustomer,
  removeCustomers,
  updateCustomer,
  getCustomerSync
};
