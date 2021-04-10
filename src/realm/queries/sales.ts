import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { SaleProperties } from '../../types/sale';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';

const app = RealmApp();

type getSalesResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Sale
 * @property {objectId} customer_id - ID of the customer paying for product(s)
 * @property {objectId} product_id - ID of the product of being sold
 * @property {objectId} employee_id - ID of the employee that made the sale
 * @property {number} total_amount - Total amount paid by customer
 * @property {string} transaction_type - Transaction type
 * @property {string} date - Date of sale
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
  return new Promise<SaleProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let customerId = mongoose.Types.ObjectId();
    let productId = mongoose.Types.ObjectId();

    sale._id = id;
    sale.customer_id = customerId;
    sale.product_id = productId;

    app.write(() => {
      try {
        let newSale: Realm.Object;
        newSale = app.create(Schemas.SaleSchema.name, sale);
        newSale = newSale.toJSON();
        let saleObject: SaleProperties = newSale as any;
        saleObject._id = saleObject._id.toHexString();
        saleObject.customer_id = saleObject.customer_id.toHexString();
        saleObject.product_id = saleObject.product_id.toHexString();
        resolve(saleObject);
      } catch (e) {
        console.log(e);
        reject(e.message);
      }
    });
  });
}

// /**
//  * @description Get product by id
//  * @async
//  * @function getProduct
//  * @param  {string} productId - The ID(identity) of the product
//  * @returns {Promise<Product>} Returns the product
//  */
// function getProduct(productId: string) {
//   return new Promise<SaleProperties>((resolve, reject) => {
//     try {
//       let convertIdToObjectId = mongoose.Types.ObjectId(productId);

//       let product = app.objectForPrimaryKey(
//         Schemas.ProductSchema.name,
//         convertIdToObjectId as ObjectId
//       );
//       let productObject: SaleProperties = product?.toJSON() as any;
//       productObject._id = productObject._id.toHexString();
//       resolve(productObject);
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

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
      let totalCount = sales.length;
      let result = sales.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        objArr.push(newObj);
      });

      let response = { totalCount: totalCount, entities: objArr };

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
//  * @param  {string} productId - The ID(identity) of the product
//  * @returns {Promise<boolean>} Returns true or false if operation is successful
//  */
// function removeProduct(productId: string) {
//   return new Promise<boolean>((resolve, reject) => {
//     try {
//       let changeToObjectId = mongoose.Types.ObjectId(productId);
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
  //   getProduct,
  getSales,
  //   removeProduct,
  //   removeProducts,
  //   updateProduct,
};