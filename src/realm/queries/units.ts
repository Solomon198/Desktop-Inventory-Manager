import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { UnitProperties } from "../../types/unit";
import { ProductProperties } from "../../types/product";
// import { productForSaleProps } from '../../types/productForSale';
import helperFuncs from "../utils/helpers.func";
import Realm from "realm";
import ProductAPI from "./products";
import helpersFunc from "../utils/helpers.func";

const app = RealmApp();

type getUnitsResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Unit
 * @property {objectId} product_id - ID of the product to assign a unit to
 * @property {string} name - Unit name assigned to the product (e.g, Pack, pieces, dozen, etc)
 * @property {number} price - Price of the product based on the assigned unit
 */

/**
 *
 * @typedef {Object} unitsResponse
 * @property {number} totalCount - total amount of units
 * @property {Array}  entities - the list of paginated units
 */

/**
 * @description Creating a new unit
 * @async
 * @function createUnit
 * @param {Unit} - Unit to be created
 * @returns {Promise<Unit>} The created unit
 */

function createUnit(unit: UnitProperties) {
  return new Promise<UnitProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let productId = mongoose.Types.ObjectId(unit.product_id);

    unit._id = id;
    unit.product_id = productId;
    unit.price = helperFuncs.transformRealmStringToNumber(unit.price);

    app.write(() => {
      try {
        let newUnit: Realm.Object;
        newUnit = app.create(Schemas.UnitSchema.name, unit);
        newUnit = newUnit.toJSON();

        let unitObject: UnitProperties = newUnit as any;
        let prodId = unitObject.product_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;

        unitObject.product_name = product.model;
        unitObject._id = unitObject._id.toHexString();
        unitObject.product_id = unitObject.product_id.toHexString();
        resolve(unitObject);
      } catch (e) {
        console.log(e);
        reject(e.message);
      }
    });
  });
}

/**
 * @description Get unit by id
 * @async
 * @function getUnitSync
 * @param  {string} unitId - The ID(identity) of the unit
 * @returns {Promise<Unit>} Returns the unit
 */
function getUnitSync(unitId: string) {
  try {
    let convertIdToObjectId = mongoose.Types.ObjectId(unitId);

    let unit = app.objectForPrimaryKey(
      Schemas.UnitSchema.name,
      convertIdToObjectId as ObjectId
    );
    let unitObject: UnitProperties = unit?.toJSON() as any;
    unitObject._id = unitObject._id.toHexString();
    return unitObject as UnitProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get all units related to a particular product Id
 * @async
 * @function getUnitsForProduct
 * @param {string} productId - The Id of the product
 * @returns {Promise<unitsResponse>} returns the total unit count and entities for the product Id
 */
function getUnitsForProduct(productId: string) {
  return new Promise<getUnitsResponse>((resolve, reject) => {
    try {
      let units: Realm.Results<Realm.Object>;
      let changeToObjectId = mongoose.Types.ObjectId(productId);
      if (changeToObjectId) {
        units = app
          .objects(Schemas.UnitSchema.name)
          .filtered("product_id = $0", changeToObjectId);
      } else {
        return false;
      }

      let result = units.slice();

      let objArr: any[] = [];
      result.forEach(obj => {
        let newObj = obj.toJSON() as UnitProperties;
        newObj.product_id = newObj.product_id.toHexString();
        newObj._id = newObj._id.toHexString();
        objArr.push(newObj);
      });

      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: objArr };

      resolve(response);
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Get units
 * @async
 * @function getUnits
 * @param {number} [page=1] - The page number of the request for units
 * @param {number} pageSize - The size of page
 * @returns {Promise<unitsResponse>} returns the total unit count and entities
 */
function getUnits(page = 1, pageSize = 10, searchQuery = "", type = "") {
  return new Promise<getUnitsResponse>((resolve, reject) => {
    try {
      let units: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1";
        units = app
          .objects(Schemas.UnitSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          "first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0";
        units = app
          .objects(Schemas.UnitSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = "cus_type == $0";
        units = app.objects(Schemas.UnitSchema.name).filtered(query, type);
      } else {
        units = app.objects(Schemas.UnitSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = units.length;
      let result = units.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj = obj.toJSON() as UnitProperties;
        let prodId = newObj.product_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;
        newObj._id = newObj._id.toHexString();
        newObj.product_name = product.model;
        try {
          newObj.name = helperFuncs.transformStringToUpperCase(newObj.name);
        } catch (e) {}
        objArr.push(newObj);
      });

      console.log(objArr);

      let paidArr = objArr.slice(partition.pageStart, partition.pageEnd);
      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: paidArr };

      resolve(response);
    } catch (e) {
      reject(e.message);
    }
  });
}

// /**
//  * @description Get salesForDebt
//  * @async
//  * @function getSalesForDebt
//  * @param {number} [page=1] - The page number of the request for salesForDebt
//  * @param {number} pageSize - The size of page
//  * @returns {Promise<unitsResponse>} returns the total saleForDebt count and entities
//  */
// function getSalesForDebt(page = 1, pageSize = 10, searchQuery = '', type = '') {
//   return new Promise<getUnitsResponse>((resolve, reject) => {
//     try {
//       let sales: Realm.Results<Realm.Object>;
//       if (searchQuery.trim() && type.trim()) {
//         let query =
//           'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
//         sales = app
//           .objects(Schemas.SaleSchema.name)
//           .filtered(query, searchQuery, type);
//       } else if (searchQuery.trim() && !type.trim()) {
//         let query =
//           'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
//         sales = app
//           .objects(Schemas.SaleSchema.name)
//           .filtered(query, searchQuery);
//       } else if (!searchQuery.trim() && type.trim()) {
//         let query = 'cus_type == $0';
//         sales = app.objects(Schemas.SaleSchema.name).filtered(query, type);
//       } else {
//         sales = app.objects(Schemas.SaleSchema.name);
//       }

//       let partition = helperFuncs.getPaginationPartition(page, pageSize);
//       // let totalCount = sales.length;
//       let result = sales.slice();

//       let objArr: any[] = [];
//       // let debtArr: any[] = [];
//       //converting to array of Object
//       result.forEach((obj) => {
//         let newObj = obj.toJSON() as UnitProperties;
//         if (newObj.status === '3' || newObj.status === '2') {
//           let cusId = newObj.customer_id.toHexString();
//           let customer = CustomerAPI.getCustomerSync(
//             cusId
//           ) as CustomerProperties;
//           newObj._id = newObj._id.toHexString();
//           newObj.customer_name = customer.first_name + ' ' + customer.last_name;
//           newObj.customer_phone = customer.phone_no;
//           try {
//             newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
//             // newObj.total_amount = newObj.total_amount.toString();
//             newObj.total_amount = helperFuncs.transformToCurrencyString(
//               newObj.total_amount
//             );
//             // newObj.part_payment = helperFuncs.transformToCurrencyString(
//             //   newObj.part_payment
//             // );
//             // newObj.outstanding = helperFuncs.transformToCurrencyString(
//             //   newObj.outstanding
//             // );
//           } catch (e) {}
//           objArr.push(newObj);
//         }
//       });

//       let debitArr = objArr.slice(partition.pageStart, partition.pageEnd);
//       let totalCount = objArr.length;

//       let response = { totalCount: totalCount, entities: debitArr };

//       resolve(response);
//     } catch (e) {
//       reject(e.message);
//     }
//   });
// }

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
// function updateProduct(productForEdit: UnitProperties) {
//   let product = Object.assign({}, productForEdit);
//   product._id = mongoose.Types.ObjectId(product._id);
//   return new Promise<UnitProperties>((resolve, reject) => {
//     app.write(() => {
//       try {
//         let productUpdate = app.create(
//           Schemas.ProductSchema.name,
//           product,
//           Realm.UpdateMode.Modified
//         );
//         let productObject: UnitProperties = productUpdate.toJSON();
//         productObject._id = productObject._id.toHexString();
//         resolve(productObject);
//       } catch (e) {
//         reject(e.message);
//       }
//     });
//   });
// }

export default {
  createUnit,
  getUnitsForProduct,
  getUnits,
  getUnitSync
  //   removeProduct,
  //   removeProducts,
  //   updateProduct,
};
