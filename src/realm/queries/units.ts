import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { UnitProperties } from '../../types/unit';
import { ProductProperties } from '../../types/product';
// import { productForSaleProps } from '../../types/productForSale';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';
import ProductAPI from './products';
import helpersFunc from '../utils/helpers.func';

const app = RealmApp();

type getUnitsResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Unit
 * @property {objectId} product_id - ID of the product to assign a unit to
 * @property {string} name - Unit name assigned to the product (e.g, Pack, pieces, dozen, etc)
 * @property {number} bulk_size - Unit bulk size
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
    unit.bulk_size = helperFuncs.transformRealmStringToNumber(unit.bulk_size);
    unit.price = helperFuncs.removeSymbolFromNumber(unit.price);
    unit.price = helperFuncs.transformRealmStringToNumber(unit.price);

    app.write(() => {
      try {
        let newUnit: Realm.Object;
        newUnit = app.create(Schemas.UnitSchema.name, unit);
        newUnit = newUnit.toJSON();

        let unitObject: UnitProperties = newUnit as any;
        let prodId = unitObject.product_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;

        unitObject.product_name = product.product_name;
        unitObject._id = unitObject._id.toHexString();
        unitObject.product_id = unitObject.product_id.toHexString();
        try {
          unitObject.price = helpersFunc.transformToCurrencyString(
            unitObject.price
          );
          unitObject.date = helpersFunc.transformDateObjectToString(
            unitObject.date
          );
        } catch (e) {
          console.log(e);
        }
        resolve(unitObject);
      } catch (e) {
        reject((e as any).message);
        console.log(e);
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
      convertIdToObjectId as any
    );
    let unitObject: UnitProperties = unit?.toJSON() as any;
    unitObject._id = unitObject._id.toHexString();
    unitObject.product_id = unitObject.product_id.toHexString();
    try {
      unitObject.price = helpersFunc.transformToCurrencyString(
        unitObject.price
      );
      // unitObject.date = helpersFunc.transformDateObjectToString(
      //   unitObject.date
      // );
    } catch (e) {
      console.log(e);
    }
    return unitObject as UnitProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get unit by id
 * @async
 * @function getUnitSync
 * @param  {string} unitId - The ID(identity) of the unit
 * @returns {Promise<Unit>} Returns the unit
 */
function getUnit(unitId: string) {
  return new Promise<UnitProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(unitId);

      let unit = app.objectForPrimaryKey(
        Schemas.UnitSchema.name,
        convertIdToObjectId as any
      );
      let unitObject: UnitProperties = unit?.toJSON() as any;
      unitObject._id = unitObject._id.toHexString();
      unitObject.product_id = unitObject.product_id.toHexString();
      try {
        unitObject.price = helpersFunc.transformToCurrencyString(
          unitObject.price
        );
        // unitObject.date = helpersFunc.transformDateObjectToString(
        //   unitObject.date
        // );
      } catch (e) {
        console.log(e);
      }
      //  return unitObject as UnitProperties;
      resolve(unitObject);
    } catch (e) {
      //  return e;
      reject((e as any).message);
    }
  });
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
          .filtered('product_id = $0', changeToObjectId);
      } else {
        return false;
      }

      let result = units.slice();

      let objArr: any[] = [];
      result.forEach((obj) => {
        let newObj = obj.toJSON() as UnitProperties;
        newObj.product_id = newObj.product_id.toHexString();
        newObj._id = newObj._id.toHexString();
        try {
          newObj.price = helpersFunc.transformToCurrencyString(newObj.price);
          newObj.date = helpersFunc.transformDateObjectToString(newObj.date);
        } catch (e) {}
        objArr.push(newObj);
      });

      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: objArr.reverse() };
      resolve(response);
    } catch (e) {
      reject((e as any).message);
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
function getUnits(page = 1, pageSize = 10, searchQuery = '', type = '') {
  return new Promise<getUnitsResponse>((resolve, reject) => {
    try {
      let units: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
        units = app
          .objects(Schemas.UnitSchema.name)
          .filtered(query, searchQuery, type)
          .sorted('date');
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        units = app
          .objects(Schemas.UnitSchema.name)
          .filtered(query, searchQuery)
          .sorted('date');
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'cus_type == $0';
        units = app
          .objects(Schemas.UnitSchema.name)
          .filtered(query, type)
          .sorted('date');
      } else {
        units = app.objects(Schemas.UnitSchema.name).sorted('date');
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = units.length;
      let result = units.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as UnitProperties;
        let prodId = newObj.product_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;
        newObj._id = newObj._id.toHexString();
        newObj.product_name = product.product_name;
        try {
          newObj.product_id = newObj.product_id.toHexString();
          newObj.name = helperFuncs.transformStringToUpperCase(newObj.name);
          newObj.price = helperFuncs.transformToCurrencyString(newObj.price);
          newObj.date = helpersFunc.transformDateObjectToString(newObj.date);
        } catch (e) {}
        objArr.push(newObj);
      });

      let paidArr = objArr.slice(partition.pageStart, partition.pageEnd);
      let totalCount = objArr.length;

      let response = { totalCount: totalCount, entities: paidArr };

      resolve(response);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Update Unit information
 * @async
 * @function updateUnit
 * @param  {...Unit} unit - the properties to be updated
 * @returns {Promise<Unit>} returns the updated unit Object
 */
function updateUnit(unitForEdit: UnitProperties) {
  let unit = Object.assign({}, unitForEdit);
  return new Promise<UnitProperties>((resolve, reject) => {
    if (unit.price.indexOf('₦') >= 0) {
      unit._id = mongoose.Types.ObjectId(unit._id);
      unit.product_id = mongoose.Types.ObjectId(unit.product_id);
      unit.bulk_size = parseInt(unit.bulk_size);
      unit.price = helperFuncs.transformCurrencyStringToNumber(unit.price);
    } else {
      unit._id = mongoose.Types.ObjectId(unit._id);
      unit.product_id = mongoose.Types.ObjectId(unit.product_id);
      unit.bulk_size = parseInt(unit.bulk_size);
      // unit.price = helperFuncs.transformCurrencyStringToNumber(unit.price);
      unit.price = helpersFunc.removeSymbolFromNumber(unit.price);
      unit.price = helpersFunc.transformRealmStringToNumber(unit.price);
    }
    app.write(() => {
      try {
        let unitUpdate = app.create(
          Schemas.UnitSchema.name,
          unit,
          Realm.UpdateMode.Modified
        );
        let unitObject: UnitProperties = unitUpdate.toJSON();
        unitObject._id = unitObject._id.toHexString();
        unitObject.product_id = unitObject.product_id.toHexString();
        try {
          unitObject.price = helpersFunc.transformToCurrencyString(
            unitObject.price
          );
          unitObject.date = helpersFunc.transformDateObjectToString(
            unitObject.date
          );
        } catch (e) {
          console.log(e);
        }
        resolve(unitObject);
      } catch (e) {
        reject((e as any).message);
        console.log(e);
      }
    });
  });
}

export default {
  createUnit,
  getUnitsForProduct,
  getUnit,
  getUnits,
  getUnitSync,
  updateUnit,
};
