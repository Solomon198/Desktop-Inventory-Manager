import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { SaleProperties } from '../../types/sale';
import { CustomerProperties } from '../../types/customer';
// import { ProductProperties } from "../../types/product";
// import { UnitProperties } from "../../types/unit";
import { productForSaleProps } from '../../types/productForSale';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';
import CustomerAPI from './customers';
// import ProductAPI from "./products";
// import UnitAPI from "./units";

const app = RealmApp();

type getSalesResponse = {
  totalCount: number;
  entities: any[];
};

type getCustomerSalesHistory = {
  customerId: any;
  // transaction_type: string;
};

/**
 * @typedef {Object} Sale
 * @property {objectId} customer_id - ID of the customer paying for product(s)
 * @property {Array} products - an array of products
 * @property {objectId} employee_id - ID of the employee that made the sale
 * @property {number} total_amount - Total amount paid by customer
 * @property {string} transaction_type - Transaction type
 * @property {string} date - Date of sale
 */

/**
 * @typedef {Object} ProductForSale
 * @property {objectId} productId - ID of the product
 * @property {objectId} unit_id - ID of the unit
 * @property {string} amount - Amount per unit
 * @property {string} name - Name of the product
 * @returns
 */

/**
 *
 * @typedef {Object} salesResponse
 * @property {number} totalCount - total amount of customers
 * @property {Array}  entities - the list of paginated customers
 */

/**
 * @description Creating a new sale
 * @async
 * @function createSale
 * @param {Sale} - Sale to be created
 * @returns {Promise<Sale>} The created sale
 */

function createSale(sale: SaleProperties) {
  sale.products.forEach((val) => {
    val._id = mongoose.Types.ObjectId();
    val.productId = mongoose.Types.ObjectId(val.productId);
    val.unit_id = mongoose.Types.ObjectId(val.unit_id);
    val.amount = helperFuncs.transformCurrencyStringToNumber(val.amount);
    val.totalAmount = helperFuncs.transformCurrencyStringToNumber(
      val.totalAmount
    );
  });
  return new Promise<SaleProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let customerId = mongoose.Types.ObjectId(sale.customer_id);

    sale._id = id;
    sale.customer_id = customerId;

    app.write(() => {
      try {
        let newSale: Realm.Object;
        newSale = app.create(Schemas.SaleSchema.name, sale);
        newSale = newSale.toJSON();

        let saleObject: SaleProperties = newSale as any;
        let cusId = saleObject.customer_id.toHexString();
        let customer = CustomerAPI.getCustomerSync(cusId) as CustomerProperties;

        try {
          saleObject.date = helperFuncs.transformDateObjectToString(
            saleObject.date
          );
        } catch (e) {}

        if (Object.keys(customer).length !== 0) {
          saleObject.customer_name = `${customer.first_name} ${customer.last_name}`;
          saleObject.customer_phone = `${customer.phone_no}`;
        } else {
          saleObject.customer_name = 'N/A';
          saleObject.customer_phone = 'N/A';
        }
        saleObject._id = saleObject._id.toHexString();
        saleObject.customer_id = saleObject.customer_id.toHexString();
        saleObject.total_amount = helperFuncs.transformToCurrencyString(
          saleObject.total_amount
        );
        saleObject.part_payment = helperFuncs.transformToCurrencyString(
          saleObject.part_payment
        );
        saleObject.outstanding = helperFuncs.transformToCurrencyString(
          saleObject.outstanding
        );
        try {
          saleObject.products.forEach((obj) => {
            obj._id = obj._id.toHexString();
            obj.amount = helperFuncs.transformToCurrencyString(obj.amount);
            obj.totalAmount = helperFuncs.transformToCurrencyString(
              obj.totalAmount
            );
          });
        } catch (e) {}
        resolve(saleObject);
      } catch (e) {
        reject((e as any).message);
        console.log(e);
      }
    });
  });
}

/**
 * @description Get Sale by id
 * @async
 * @function getSale
 * @param  {string} saleId - The ID(identity) of the sale
 * @returns {Promise<Sale>} Returns the sale
 */
function getSale(saleId: string) {
  return new Promise<SaleProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(saleId);

      let sale = app.objectForPrimaryKey(
        Schemas.SaleSchema.name,
        convertIdToObjectId as ObjectId
      );
      let saleObject: SaleProperties = sale?.toJSON() as any;
      saleObject._id = saleObject._id.toHexString();
      saleObject.customer_id = saleObject.customer_id.toHexString();
      try {
        saleObject.products.forEach((obj) => {
          obj._id = obj._id.toHexString();
          obj.amount = helperFuncs.transformToCurrencyString(obj.amount);
          obj.totalAmount = helperFuncs.transformToCurrencyString(
            obj.totalAmount
          );
        });
      } catch (e) {}
      let customer = CustomerAPI.getCustomerSync(
        saleObject.customer_id
      ) as CustomerProperties;
      if (Object.keys(customer).length !== 0) {
        saleObject.customer_name = `${customer.first_name} ${customer.last_name}`;
        saleObject.customer_phone = `${customer.phone_no}`;
      } else {
        saleObject.customer_name = 'N/A';
        saleObject.customer_phone = 'N/A';
      }
      try {
        saleObject.date = helperFuncs.transformDateObjectToString(
          saleObject.date
        );
        saleObject.total_amount = helperFuncs.transformToCurrencyString(
          saleObject.total_amount
        );
        saleObject.part_payment = helperFuncs.transformToCurrencyString(
          saleObject.part_payment
        );
        saleObject.outstanding = helperFuncs.transformToCurrencyString(
          saleObject.outstanding
        );
      } catch (e) {}
      resolve(saleObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get Sale by id
 * @async
 * @function getCustomerSalesHistory
 * @param  {string} customerId - The ID(identity) of the customer
 * @returns {Promise<salesResponse>} Returns the sale
 */
function getCustomerSalesHistory(pageNumber = 1, pageSize = 5, customerId) {
  return new Promise<getSalesResponse>((resolve, reject) => {
    mongoose.Types.ObjectId(customerId);
    try {
      let sales: Realm.Results<Realm.Object>;
      let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

      sales = app
        .objects(Schemas.SaleSchema.name)
        .filtered('customer_id = $0', convertIdToObjectId);

      let partition = helperFuncs.getPaginationPartition(pageNumber, pageSize);
      // let totalCount = sales.length;
      let result = sales.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];

      result.forEach((obj) => {
        let newObj = obj.toJSON() as SaleProperties;
        if (newObj.transaction_type === '1' && !newObj.outstanding) {
          newObj._id = newObj._id.toHexString();
          newObj.customer_id = newObj.customer_id.toHexString();
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
          newObj.part_payment = helperFuncs.transformToCurrencyString(
            newObj.part_payment
          );
          newObj.outstanding = helperFuncs.transformToCurrencyString(
            newObj.outstanding
          );

          let createdDate = newObj.date;

          let arrProducts: any[] = newObj.products;

          arrProducts.forEach((productObj: productForSaleProps) => {
            let _newObj = productObj as productForSaleProps;
            _newObj._id = _newObj._id.toHexString();
            _newObj.productId = _newObj.productId.toHexString();
            _newObj.unit_id = _newObj.unit_id.toHexString();
            _newObj.date = createdDate;

            try {
              _newObj.totalAmount = helperFuncs.transformToCurrencyString(
                _newObj.totalAmount
              );
            } catch (e) {}
            objArr.push(_newObj);
          });
        }
      });
      let totalCount = objArr.length;
      console.log('____objArr___', objArr);
      console.log('___totalCount API', totalCount);

      let response = { totalCount: totalCount, entities: objArr };

      resolve(response);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get Sale by id
 * @async
 * @function getCustomerDebtsHistory
 * @param  {string} customerId - The ID(identity) of the customer
 * @returns {Promise<salesResponse>} Returns the sale
 */
function getCustomerDebtsHistory(pageNumber = 1, pageSize = 5, customerId) {
  return new Promise<getSalesResponse>((resolve, reject) => {
    mongoose.Types.ObjectId(customerId);
    try {
      let sales: Realm.Results<Realm.Object>;
      let convertIdToObjectId = mongoose.Types.ObjectId(customerId);

      sales = app
        .objects(Schemas.SaleSchema.name)
        .filtered('customer_id = $0', convertIdToObjectId);

      let partition = helperFuncs.getPaginationPartition(pageNumber, pageSize);

      let result = sales.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];

      result.forEach((obj) => {
        let newObj = obj.toJSON() as SaleProperties;
        if (newObj.transaction_type === '2') {
          newObj._id = newObj._id.toHexString();
          newObj.customer_id = newObj.customer_id.toHexString();
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
          newObj.total_amount = helperFuncs.transformToCurrencyString(
            newObj.total_amount
          );
          newObj.part_payment = helperFuncs.transformToCurrencyString(
            newObj.part_payment
          );
          newObj.outstanding = helperFuncs.transformToCurrencyString(
            newObj.outstanding
          );

          objArr.push(newObj);
        }
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
 * @description Get sales
 * @async
 * @function getSales
 * @param {number} [page=1] - The page number of the request for sales
 * @param {number} pageSize - The size of page
 * @returns {Promise<salesResponse>} returns the total sale count and entities
 */
function getSales(page = 1, pageSize = 10, searchQuery = '', type = '') {
  return new Promise<getSalesResponse>((resolve, reject) => {
    try {
      let sales: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery, type)
          .sorted('date');
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery)
          .sorted('date');
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'cus_type == $0';
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, type)
          .sorted('date');
      } else {
        sales = app.objects(Schemas.SaleSchema.name).sorted('date');
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = sales.length;
      let result = sales.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as SaleProperties;
        let cusId = newObj.customer_id.toHexString();
        let customer = CustomerAPI.getCustomerSync(cusId) as CustomerProperties;
        newObj._id = newObj._id.toHexString();
        if (Object.keys(customer).length !== 0) {
          newObj.customer_name = `${customer.first_name} ${customer.last_name}`;
          newObj.customer_phone = customer.phone_no;
        } else {
          newObj.customer_name = `N/A`;
          newObj.customer_phone = `N/A`;
        }

        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
          newObj.total_amount = helperFuncs.transformToCurrencyString(
            newObj.total_amount
          );
          newObj.part_payment = helperFuncs.transformToCurrencyString(
            newObj.part_payment
          );
          newObj.outstanding = helperFuncs.transformToCurrencyString(
            newObj.outstanding
          );
        } catch (e) {}
        objArr.push(newObj);
      });

      let response = { totalCount: totalCount, entities: objArr.reverse() };

      resolve(response);
    } catch (e) {
      reject((e as any).message);
      console.log(e);
    }
  });
}

/**
 * @description Get salesForDebt
 * @async
 * @function getSalesForDebt
 * @param {number} [page=1] - The page number of the request for salesForDebt
 * @param {number} pageSize - The size of page
 * @returns {Promise<salesResponse>} returns the total saleForDebt count and entities
 */
function getSalesForDebt(page = 1, pageSize = 10, searchQuery = '', type = '') {
  return new Promise<getSalesResponse>((resolve, reject) => {
    try {
      let sales: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'cus_type == $0';
        sales = app.objects(Schemas.SaleSchema.name).filtered(query, type);
      } else {
        sales = app.objects(Schemas.SaleSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = sales.length;
      let result = sales.slice(partition.pageStart, partition.pageEnd);
      let objArr: any[] = [];

      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as SaleProperties;
        if (newObj.transaction_type === '2') {
          let cusId = newObj.customer_id.toHexString();
          let customer = CustomerAPI.getCustomerSync(
            cusId
          ) as CustomerProperties;
          newObj._id = newObj._id.toHexString();
          newObj.customer_id = newObj.customer_id.toHexString();

          if (Object.keys(customer).length !== 0) {
            newObj.customer_name = `${customer.first_name} ${customer.last_name}`;
            newObj.customer_phone = `${customer.phone_no}`;
          } else {
            newObj.customer_name = `N/A`;
            newObj.customer_phone = `N/A`;
          }

          try {
            newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
            newObj.total_amount = helperFuncs.transformToCurrencyString(
              newObj.total_amount
            );
            newObj.part_payment = helperFuncs.transformToCurrencyString(
              newObj.part_payment
            );
            newObj.outstanding = helperFuncs.transformToCurrencyString(
              newObj.outstanding
            );
          } catch (e) {}
          objArr.push(newObj);
        }
      });

      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: objArr };

      resolve(response);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

export default {
  createSale,
  getSale,
  getCustomerSalesHistory,
  getCustomerDebtsHistory,
  getSales,
  getSalesForDebt,
};
