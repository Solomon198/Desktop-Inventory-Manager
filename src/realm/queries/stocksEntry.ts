import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { StockEntryProperties } from '../../types/stockEntry';
import { ProductProperties } from '../../types/product';
import { UnitProperties } from '../../types/unit';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';
import ProductAPI from './products';
import UnitAPI from './units';
// import helpersFunc from "../utils/helpers.func";

const app = RealmApp();

type getStocksEntryResponse = {
  totalCount: number;
  entities: any[];
};

type decrementStockEntry = {
  unit_id: any;
  quantity: number;
};

/**
 * @typedef {Object} StockEntry
 * @property {objectId} unit_id - ID of the unit for a product
 * @property {number} quantity - Quantity of the product per unit
 */

/**
 *
 * @typedef {Object} stocksEntryResponse
 * @property {number} totalCount - total amount of stocks entry
 * @property {Array}  entities - the list of paginated stocks entry
 */

/**
 * @description Creating a new stock entry
 * @async
 * @function createStockEntry
 * @param {StockEntry} - Stock to be created
 * @returns {Promise<StockEntry>} The created stock entry
 */

function createStockEntry(stock: StockEntryProperties) {
  return new Promise<StockEntryProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let unitId = mongoose.Types.ObjectId(stock.unit_id);
    let productId = mongoose.Types.ObjectId(stock.product_id);

    stock._id = id;
    stock.unit_id = unitId;
    stock.product_id = productId;
    stock.quantity = helperFuncs.transformRealmStringToNumber(stock.quantity);

    app.write(() => {
      try {
        let newStock: Realm.Object;
        let getStockEntry = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered('unit_id == $0', stock.unit_id);
        if (getStockEntry.length > 0) {
          //run an update
          let objToUpdate: any = getStockEntry[0];
          objToUpdate.quantity += stock.quantity;
          let stockObject: StockEntryProperties = objToUpdate.toJSON() as any;
          let uId = stockObject.unit_id.toHexString();
          let prodId = stockObject.product_id.toHexString();
          let unit = UnitAPI.getUnitSync(uId) as UnitProperties;
          let product = ProductAPI.getProductSync(prodId) as ProductProperties;

          stockObject.unit_name = unit.name;
          stockObject.product_name = product.product_name;
          stockObject._id = stockObject._id.toHexString();
          stockObject.unit_id = stockObject.unit_id.toHexString();
          stockObject.product_id = stockObject.product_id.toHexString();
          try {
            stockObject.unit_name = helperFuncs.transformStringToUpperCase(
              stockObject.unit_name
            );
          } catch (e) {}
          resolve(stockObject);
        } else {
          newStock = app.create(Schemas.StockEntrySchema.name, stock);
          newStock = newStock.toJSON();

          let stockObject: StockEntryProperties = newStock as any;
          let uId = stockObject.unit_id.toHexString();
          let prodId = stockObject.product_id.toHexString();
          let unit = UnitAPI.getUnitSync(uId) as UnitProperties;
          let product = ProductAPI.getProductSync(prodId) as ProductProperties;

          stockObject.unit_name = unit.name;
          stockObject.product_name = product.product_name;
          stockObject._id = stockObject._id.toHexString();
          stockObject.unit_id = stockObject.unit_id.toHexString();
          stockObject.product_id = stockObject.product_id.toHexString();
          try {
            stockObject.unit_name = helperFuncs.transformStringToUpperCase(
              stockObject.unit_name
            );
          } catch (e) {}
          resolve(stockObject);
        }
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

/**
 * @description Get Stock Entry by id
 * @async
 * @function getStockEntry
 * @param  {string} stockId - The ID(identity) of the stock entry
 * @returns {Promise<Stock>} Returns the stock entry
 */
function getStockEntry(stockId: string) {
  return new Promise<StockEntryProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(stockId);

      let stock = app.objectForPrimaryKey(
        Schemas.StockEntrySchema.name,
        convertIdToObjectId as ObjectId
      );
      let stockObject: StockEntryProperties = stock?.toJSON() as any;
      stockObject._id = stockObject._id.toHexString();
      stockObject.unit_id = stockObject.unit_id.toHexString();
      stockObject.product_id = stockObject.product_id.toHexString();
      let unit = UnitAPI.getUnitSync(stockObject.unit_id) as UnitProperties;
      let product = ProductAPI.getProductSync(
        stockObject.product_id
      ) as ProductProperties;
      stockObject.unit_name = `${unit.name}`;
      stockObject.product_name = `${product.product_name}`;

      resolve(stockObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get product quantity by unit ID
 * @async
 * @function getQuantityByUnitId
 * @param  {string} unitId - The ID(identity) of the unit
 * @returns {Promise<Stock>} Returns the total quantity of the unit
 */
function getQuantityByUnitId(unitId: string) {
  return new Promise<getStocksEntryResponse>((resolve, reject) => {
    try {
      let stocks: Realm.Results<Realm.Object>;
      let changeToObjectId = mongoose.Types.ObjectId(unitId);
      // let convertIdToObjectId = mongoose.Types.ObjectId(stockId);

      if (changeToObjectId) {
        stocks = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered('unit_id = $0', changeToObjectId);
      } else {
        return false;
      }

      let result = stocks.slice();

      let objArr: any[] = [];

      result.forEach((obj) => {
        let newObj = obj.toJSON() as StockEntryProperties;
        newObj._id = newObj._id.toHexString();
        newObj.product_id = newObj.product_id.toHexString();
        newObj.unit_id = newObj.unit_id.toHexString();
        objArr.push(newObj);
      });

      let totalCount = objArr.length;

      let response = { totalCount, entities: objArr };
      resolve(response);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Check if a product is out of stock
 * @async
 * @function isOutOfStocksEntry
 * @param  {{unit_id: string, quantity: number}} stocksEntry - unit ID and quantity
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function isOutOfStocksEntry(stocksEntry: {
  unit_id: string;
  quantity: number;
}) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      // let stock: Realm.Results<Realm.Object>;
      let stock;
      let changeToObjectId = mongoose.Types.ObjectId(stocksEntry.unit_id);

      if (changeToObjectId) {
        app.write(() => {
          stock = app
            .objects(Schemas.StockEntrySchema.name)
            .filtered('unit_id = $0', changeToObjectId);
        });
      } else {
        return false;
      }

      if (stock.length > 0) {
        let getStockEntryObj = stock[0];

        if (getStockEntryObj.quantity < stocksEntry.quantity) resolve(true);
        resolve(false);
      }
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description increment stock by a specified unitID and number of quanties
 * @async
 * @function incrementStockEntry
 * @param  {Object} stocksEntry - unit IDs and quantities
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function incrementStockEntry(stockEntry: decrementStockEntry) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let stock;

      const unitId = mongoose.Types.ObjectId(stockEntry.unit_id);
      stockEntry.unit_id = unitId;

      if (stockEntry) {
        app.write(() => {
          stock = app
            .objects(Schemas.StockEntrySchema.name)
            .filtered('unit_id = $0', stockEntry.unit_id);
          stock[0].quantity += stockEntry.quantity;
        });
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description decrement stock by a specified unitID and number of quanties
 * @async
 * @function decrementStockEntry
 * @param  {Object} stocksEntry - unit IDs and quantities
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function decrementStockEntry(stockEntry: decrementStockEntry) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let stock;

      const unitId = mongoose.Types.ObjectId(stockEntry.unit_id);
      stockEntry.unit_id = unitId;

      if (stockEntry) {
        app.write(() => {
          stock = app
            .objects(Schemas.StockEntrySchema.name)
            .filtered('unit_id = $0', stockEntry.unit_id);
          stock[0].quantity -= stockEntry.quantity;
        });
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get unit ID and quantity for a products
 * @async
 * @function decrementStocksEntry
 * @param  {any[]} stocksEntry - unit IDs and quantities
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function decrementStocksEntry(stocksEntry: any[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      // let stocks: Realm.Results<Realm.Object>;
      let stocks;
      let stocksEntryArr: any[] = [];

      stocksEntry.forEach((val) => {
        stocksEntryArr.push({
          unit_id: mongoose.Types.ObjectId(val.unit_id) as any,
          quantity: val.quantity,
        });
      });

      if (stocksEntryArr) {
        app.write(() => {
          stocksEntryArr.forEach((valz) => {
            stocks = app
              .objects(Schemas.StockEntrySchema.name)
              .filtered('unit_id = $0', valz.unit_id);
            stocks[0].quantity -= valz.quantity;
          });
        });
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get stocks entries for unit quantities
//  * @async
 * @function getStocksEntryForUnitQuatity
 * @param {number} [page=1] - The page number of the request for stocks entries for unit quantities
 * @param {number} pageSize - The size of page
 * @returns {Promise<stocksEntryResponse>} returns the total stock entry for unit quantities count and entities
//  */
function getStocksEntryForUnitQuatity(
  page = 1,
  pageSize = 10,
  searchQuery = '',
  type = '',
  unitId = ''
) {
  console.log(unitId);
  return new Promise<getStocksEntryResponse>((resolve, reject) => {
    try {
      let stocks: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
        stocks = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        stocks = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'cus_type == $0';
        stocks = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered(query, type);
      } else {
        stocks = app.objects(Schemas.StockEntrySchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = stocks.length;
      let result = stocks.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as StockEntryProperties;
        let unitId = newObj.unit_id.toHexString();
        let unit = UnitAPI.getUnitSync(unitId) as UnitProperties;
        newObj._id = newObj._id.toHexString();
        newObj.unit_name = unit.name;
        try {
          newObj.quantity = newObj.quantity.toString();
        } catch (e) {}
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
 * @description Get stocks entries
//  * @async
 * @function getStocksEntry
 * @param {number} [page=1] - The page number of the request for stocks entries
 * @param {number} pageSize - The size of page
 * @returns {Promise<stocksEntryResponse>} returns the total stock entry count and entities
//  */
function getStocksEntry(page = 1, pageSize = 10, searchQuery = '', type = '') {
  return new Promise<getStocksEntryResponse>((resolve, reject) => {
    try {
      let stocks: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
        stocks = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        stocks = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'cus_type == $0';
        stocks = app
          .objects(Schemas.StockEntrySchema.name)
          .filtered(query, type);
      } else {
        stocks = app.objects(Schemas.StockEntrySchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = stocks.length;
      let result = stocks.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as StockEntryProperties;
        let unitId = newObj.unit_id.toHexString();
        let unit = UnitAPI.getUnitSync(unitId) as UnitProperties;
        let prodId = newObj.product_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;
        newObj._id = newObj._id.toHexString();
        newObj.unit_name = unit.name;
        newObj.product_name = product.product_name;
        try {
          newObj.quantity = newObj.quantity.toString();
          newObj.unit_name = helperFuncs.transformStringToUpperCase(
            newObj.unit_name
          );
        } catch (e) {}
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
 * @description Remove stock entry by id
 * @async
 * @function removeStockEntry
 * @param  {string} stockId - The ID(identity) of the stock entry
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeStockEntry(stockId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(stockId);
      app.write(() => {
        let stock = app.objectForPrimaryKey(
          Schemas.StockEntrySchema.name,
          changeToObjectId as ObjectId
        );
        app.delete(stock);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Remove stocks entries by id
 * @async
 * @function removeStocksEntry
 * @param  {string[]} stockIds - The IDs(identities) of the stocks entry
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeStocksEntry(stockIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      stockIds.forEach((id) => {
        changeToObjectIds.push(
          mongoose.Types.ObjectId(id) as mongoose.Types.ObjectId
        );
      });

      app.write(() => {
        changeToObjectIds.forEach((id) => {
          let stock = app.objectForPrimaryKey(
            Schemas.StockEntrySchema.name,
            id as ObjectId
          );
          app.delete(stock);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Update Stock entry information
 * @async
 * @function updateStockEntry
 * @param  {...Stock} stock - the properties to be updated
 * @returns {Promise<Stock>} returns the updated stock entry Object
 */
function updateStockEntry(stockForEdit: StockEntryProperties) {
  let stock = Object.assign({}, stockForEdit);
  stock._id = mongoose.Types.ObjectId(stock._id);
  return new Promise<StockEntryProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let stockUpdate = app.create(
          Schemas.StockEntrySchema.name,
          stock,
          Realm.UpdateMode.Modified
        );
        let stockObject: StockEntryProperties = stockUpdate.toJSON();
        stockObject._id = stockObject._id.toHexString();
        resolve(stockObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

export default {
  createStockEntry,
  getStockEntry,
  getStocksEntry,
  getQuantityByUnitId,
  getStocksEntryForUnitQuatity,
  isOutOfStocksEntry,
  incrementStockEntry,
  decrementStockEntry,
  decrementStocksEntry,
  removeStockEntry,
  removeStocksEntry,
  updateStockEntry,
};
