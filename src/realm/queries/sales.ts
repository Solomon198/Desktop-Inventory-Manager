import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { SaleProperties } from "../../types/sale";
import { CustomerProperties } from "../../types/customer";
import { productForSaleProps } from "../../types/productForSale";
import helperFuncs from "../utils/helpers.func";
import Realm from "realm";
import CustomerAPI from "./customers";

const app = RealmApp();

type getSalesResponse = {
  totalCount: number;
  entities: any[];
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
 * @property {objectId} saleId - ID of the product
 * @property {string} unit - Unit of the product e.g pack, dozen, card, e.t.c
 * @property {string} amount - Amount per unit of the product
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
  sale.products.forEach(val => {
    val._id = mongoose.Types.ObjectId();
  });
  return new Promise<SaleProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let customerId = mongoose.Types.ObjectId(sale.customer_id);

    sale._id = id;
    sale.customer_id = customerId;
    sale.part_payment = helperFuncs.transformRealmStringToNumber(
      sale.part_payment
    );

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

        saleObject.customer_name =
          customer.first_name + " " + customer.last_name;
        saleObject.customer_phone = customer.phone_no;
        saleObject._id = saleObject._id.toHexString();
        saleObject.customer_id = saleObject.customer_id.toHexString();
        resolve(saleObject);
      } catch (e) {
        console.log(e);
        reject(e.message);
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
        saleObject.products.forEach(obj => {
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
      saleObject.customer_name = `${customer.first_name} ${customer.last_name}`;
      saleObject.customer_phone = `${customer.phone_no}`;
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
      reject(e.message);
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
function getSales(page = 1, pageSize = 10, searchQuery = "", type = "") {
  return new Promise<getSalesResponse>((resolve, reject) => {
    try {
      let sales: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1";
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0";
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = "cus_type == $0";
        sales = app.objects(Schemas.SaleSchema.name).filtered(query, type);
      } else {
        sales = app.objects(Schemas.SaleSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = sales.length;
      let result = sales.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj = obj.toJSON() as SaleProperties;
        if (newObj.transaction_type === "1" && newObj.status === "1") {
          let cusId = newObj.customer_id.toHexString();
          let customer = CustomerAPI.getCustomerSync(
            cusId
          ) as CustomerProperties;
          newObj._id = newObj._id.toHexString();
          newObj.customer_name = customer.first_name + " " + customer.last_name;
          newObj.customer_phone = customer.phone_no;
          try {
            newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
            // newObj.total_amount = newObj.total_amount.toString();
            newObj.total_amount = helperFuncs.transformToCurrencyString(
              newObj.total_amount
            );
            // newObj.part_payment = helperFuncs.transformToCurrencyString(
            //   newObj.part_payment
            // );
            // newObj.outstanding = helperFuncs.transformToCurrencyString(
            //   newObj.outstanding
            // );
          } catch (e) {}
          objArr.push(newObj);
        }
      });

      let paidArr = objArr.slice(partition.pageStart, partition.pageEnd);
      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: paidArr };

      resolve(response);
    } catch (e) {
      reject(e.message);
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
function getSalesForDebt(page = 1, pageSize = 10, searchQuery = "", type = "") {
  return new Promise<getSalesResponse>((resolve, reject) => {
    try {
      let sales: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1";
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0";
        sales = app
          .objects(Schemas.SaleSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = "cus_type == $0";
        sales = app.objects(Schemas.SaleSchema.name).filtered(query, type);
      } else {
        sales = app.objects(Schemas.SaleSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = sales.length;
      let result = sales.slice();

      let objArr: any[] = [];
      // let debtArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj = obj.toJSON() as SaleProperties;
        if (newObj.status === "3" || newObj.status === "2") {
          let cusId = newObj.customer_id.toHexString();
          let customer = CustomerAPI.getCustomerSync(
            cusId
          ) as CustomerProperties;
          newObj._id = newObj._id.toHexString();
          newObj.customer_name = customer.first_name + " " + customer.last_name;
          newObj.customer_phone = customer.phone_no;
          try {
            newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
            // newObj.total_amount = newObj.total_amount.toString();
            newObj.total_amount = helperFuncs.transformToCurrencyString(
              newObj.total_amount
            );
            // newObj.part_payment = helperFuncs.transformToCurrencyString(
            //   newObj.part_payment
            // );
            // newObj.outstanding = helperFuncs.transformToCurrencyString(
            //   newObj.outstanding
            // );
          } catch (e) {}
          objArr.push(newObj);
        }
      });

      let debitArr = objArr.slice(partition.pageStart, partition.pageEnd);
      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: debitArr };

      resolve(response);
    } catch (e) {
      reject(e.message);
    }
  });
}

// /**
//  * @description Remove product by id
//  * @async
//  * @function removeProduct
//  * @param  {string} saleId - The ID(identity) of the product
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function removeProduct(saleId: string) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       let changeToObjectId = mongoose.Types.ObjectId(saleId);
//       app.write(() => {
//         let product = app.objectForPrimaryKey(
//           Schemas.ProductSchema.name,
//           changeToObjectId as ObjectId
//         );
//         app.delete(product);
//         resolve(true);
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Remove product by id
//  * @async
//  * @function removeProducts
//  * @param  {string[]} productIds - The IDs(identities) of the products
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function removeProducts(productIds: string[]) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       let changeToObjectIds: ObjectId[] = [];

//       productIds.forEach((id) => {
//         changeToObjectIds.push(mongoose.Types.ObjectId(id) as ObjectId);
//       });

//       app.write(() => {
//         changeToObjectIds.forEach((id) => {
//           let product = app.objectForPrimaryKey(Schemas.ProductSchema.name, id);
//           app.delete(product);
//         });

//         resolve(true);
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e.message);
//     }
//   });
// }

// /**
//  * @description Update Product information
//  * @async
//  * @function updateProduct
//  * @param  {...Product} product - the properties to be updated
//  * @returns {Promise<Product>} returns the updated product Object
//  */
// function updateProduct(productForEdit: SaleProperties) {
//   let product = Object.assign({}, productForEdit);
//   product._id = mongoose.Types.ObjectId(product._id);
//   return new Promise<SaleProperties>((resolve, reject) => {
//     app.write(() => {
//       try {
//         let productUpdate = app.create(
//           Schemas.ProductSchema.name,
//           product,
//           Realm.UpdateMode.Modified
//         );
//         let productObject: SaleProperties = productUpdate.toJSON();
//         productObject._id = productObject._id.toHexString();
//         resolve(productObject);
//       } catch (e) {
//         reject(e.message);
//       }
//     });
//   });
// }

export default {
  createSale,
  getSale,
  getSales,
  getSalesForDebt
  //   removeProduct,
  //   removeProducts,
  //   updateProduct,
};
