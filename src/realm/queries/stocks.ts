import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { StockProperties } from '../../types/stock';
import { ProductProperties } from '../../types/product';
import { UnitProperties } from '../../types/unit';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';
import ProductAPI from './products';
import UnitAPI from './units';
// import helpersFunc from "../utils/helpers.func";

const app = RealmApp();

type getStocksResponse = {
  totalCount: number;
  entities: any[];
};

type filterRange = {
  start_date: string;
  end_date: string;
  pageNumber: number;
  pageSize: number;
};

/**
 * @typedef {Object} Stock
 * @property {objectId} product_id - ID of the product to be stocked
 * @property {objectId} unit_id - ID of the unit for a product
 * @property {number} quantity - Quantity of the product per unit
 * @property {string} date - Stock creation date
 */

/**
 *
 * @typedef {Object} stocksResponse
 * @property {number} totalCount - total amount of stocks
 * @property {Array}  entities - the list of paginated stocks
 */

/**
 * @description Creating a new stock
 * @async
 * @function createStock
 * @param {Stock} - Stock to be created
 * @returns {Promise<Stock>} The created stock
 */

function createStock(stock: StockProperties) {
  return new Promise<StockProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let productId = mongoose.Types.ObjectId(stock.product_id);
    let unitId = mongoose.Types.ObjectId(stock.unit_id);

    stock._id = id;
    stock.product_id = productId;
    stock.unit_id = unitId;
    stock.quantity = helperFuncs.transformRealmStringToNumber(stock.quantity);

    app.write(() => {
      try {
        let newStock: Realm.Object;
        newStock = app.create(Schemas.StockSchema.name, stock);
        newStock = newStock.toJSON();

        let stockObject: StockProperties = newStock as any;
        let prodId = stockObject.product_id.toHexString();
        let uId = stockObject.unit_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;
        let unit = UnitAPI.getUnitSync(uId) as UnitProperties;

        stockObject.product_name = product.product_name;
        stockObject.unit_name = unit.name;
        stockObject._id = stockObject._id.toHexString();
        stockObject.product_id = stockObject.product_id.toHexString();
        stockObject.unit_id = stockObject.unit_id.toHexString();
        try {
          stockObject.date = helperFuncs.transformDateObjectToString(
            stockObject.date
          );
          stockObject.unit_name = helperFuncs.transformStringToUpperCase(
            stockObject.unit_name
          );
        } catch (e) {}
        resolve(stockObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

/**
 * @description Get Stock by id
 * @async
 * @function getStock
 * @param  {string} stockId - The ID(identity) of the stock
 * @returns {Promise<Stock>} Returns the stock
 */
function getStock(stockId: string) {
  return new Promise<StockProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(stockId);

      let stock = app.objectForPrimaryKey(
        Schemas.StockSchema.name,
        convertIdToObjectId as ObjectId
      );
      let stockObject: StockProperties = stock?.toJSON() as any;
      stockObject._id = stockObject._id.toHexString();
      stockObject.product_id = stockObject.product_id.toHexString();
      stockObject.unit_id = stockObject.unit_id.toHexString();
      let product = ProductAPI.getProductSync(
        stockObject.product_id
      ) as ProductProperties;
      let unit = UnitAPI.getUnitSync(stockObject.unit_id) as UnitProperties;
      stockObject.product_name = `${product.product_name}`;
      stockObject.unit_name = `${unit.name}`;
      // try {
      //   stockObject.date = helperFuncs.transformDateObjectToString(
      //     stockObject.date
      //   );
      // } catch (e) {}
      resolve(stockObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get stocks
//  * @async
 * @function getStocks
 * @param {number} [page=1] - The page number of the request for stocks
 * @param {number} pageSize - The size of page
 * @returns {Promise<stocksResponse>} returns the total stock count and entities
//  */
function getStocks(page = 1, pageSize = 10, searchQuery = '', type = '') {
  return new Promise<getStocksResponse>((resolve, reject) => {
    try {
      let stocks: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
        stocks = app
          .objects(Schemas.StockSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        stocks = app
          .objects(Schemas.StockSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'cus_type == $0';
        stocks = app.objects(Schemas.StockSchema.name).filtered(query, type);
      } else {
        stocks = app.objects(Schemas.StockSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      // let totalCount = stocks.length;
      let result = stocks.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as StockProperties;
        let prodId = newObj.product_id.toHexString();
        let unitId = newObj.unit_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;
        let unit = UnitAPI.getUnitSync(unitId) as UnitProperties;
        newObj._id = newObj._id.toHexString();
        newObj.product_name = product.product_name;
        newObj.unit_name = unit.name;
        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
          newObj.quantity = newObj.quantity.toString();
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
 * @description Get filter products in stock
 * @async
 * @function getFilterProducts
 * @param {number} [page=1] - The page number of the requested filtered products
 * @param {number} [pageSize=10] - The page size of the requested filtered products
 * @param {filterRange} - An object that contain the start and end date for filtering products
 * @returns {Promise<stocksResponse>} returns the total filtered products count and entities
//  */
function getFilterProducts(filterRange: filterRange) {
  return new Promise<getStocksResponse>((resolve, reject) => {
    try {
      let stocks: Realm.Results<Realm.Object>;
      stocks = app.objects(Schemas.StockSchema.name);

      let partition = helperFuncs.getPaginationPartition(
        filterRange.pageNumber,
        filterRange.pageSize
      );
      // let totalCount = stocks.length;
      let result = stocks.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON() as StockProperties;
        let prodId = newObj.product_id.toHexString();
        let unitId = newObj.unit_id.toHexString();
        let product = ProductAPI.getProductSync(prodId) as ProductProperties;
        let unit = UnitAPI.getUnitSync(unitId) as UnitProperties;
        newObj._id = newObj._id.toHexString();
        newObj.product_name = product.product_name;
        newObj.unit_name = unit.name;
        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
          newObj.quantity = newObj.quantity.toString();
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
 * @description Remove stock by id
 * @async
 * @function removeStock
 * @param  {string} stockId - The ID(identity) of the stock
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeStock(stockId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(stockId);
      app.write(() => {
        let stock = app.objectForPrimaryKey(
          Schemas.StockSchema.name,
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
 * @description Remove stocks by id
 * @async
 * @function removeStocks
 * @param  {string[]} stockIds - The IDs(identities) of the stocks
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeStocks(stockIds: string[]) {
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
            Schemas.StockSchema.name,
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
 * @description Update Stock information
 * @async
 * @function updateStock
 * @param  {...Stock} stock - the properties to be updated
 * @returns {Promise<Stock>} returns the updated stock Object
 */
function updateStock(stockForEdit: StockProperties) {
  let stock = Object.assign({}, stockForEdit);
  stock._id = mongoose.Types.ObjectId(stock._id);
  return new Promise<StockProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let stockUpdate = app.create(
          Schemas.StockSchema.name,
          stock,
          Realm.UpdateMode.Modified
        );
        let stockObject: StockProperties = stockUpdate.toJSON();
        stockObject._id = stockObject._id.toHexString();
        resolve(stockObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

export default {
  createStock,
  getStock,
  getStocks,
  getFilterProducts,
  removeStock,
  removeStocks,
  updateStock,
};
