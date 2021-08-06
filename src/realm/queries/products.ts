import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { ProductProperties } from '../../types/product';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';

const app = RealmApp();

type getProductsResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Product
 * @property {string} model - Product model
 * @property {string} manufacturer - Product manufacturer
 * @property {number} model_year - Product model year
 * @property {string} vin_code - Product VIN code
 * @property {string} description - Product description
 */

/**
 *
 * @typedef {Object} productsResponse
 * @property {number} totalCount - total amount of customers
 * @property {Array}  entities - the list of paginated customers
 */

/**
 * @description Creating a new product for the current organization
 * @async
 * @function createProduct
 * @param {Product} - Product to be created
 * @returns {Promise<Product>} The created product
 */

function createProduct(product: ProductProperties) {
  return new Promise<ProductProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();

    product._id = id;

    app.write(() => {
      try {
        let newProduct: Realm.Object;
        newProduct = app.create(Schemas.ProductSchema.name, product);
        newProduct = newProduct.toJSON();
        let productObject: ProductProperties = newProduct as any;
        productObject._id = productObject._id.toHexString();
        resolve(productObject);
      } catch (e) {
        console.log(e);
        reject(e.message);
      }
    });
  });
}

/**
 * @description Get product by id
 * @async
 * @function getProductSync
 * @param  {string} productId - The ID(identity) of the product
 * @returns {Promise<Product>} Returns the product
 */
function getProductSync(productId: string) {
  try {
    let convertIdToObjectId = mongoose.Types.ObjectId(productId);

    let product = app.objectForPrimaryKey(
      Schemas.ProductSchema.name,
      convertIdToObjectId as ObjectId
    );
    let productObject: ProductProperties = product?.toJSON() as any;
    productObject._id = productObject._id.toHexString();
    return productObject as ProductProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get product by id
 * @async
 * @function getProduct
 * @param  {string} productId - The ID(identity) of the product
 * @returns {Promise<Product>} Returns the product
 */
function getProduct(productId: string) {
  return new Promise<ProductProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(productId);

      let product = app.objectForPrimaryKey(
        Schemas.ProductSchema.name,
        convertIdToObjectId as ObjectId
      );
      let productObject: ProductProperties = product?.toJSON() as any;
      productObject._id = productObject._id.toHexString();
      resolve(productObject);
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Get products
 * @async
 * @function getProducts
 * @param {number} [page=1] - The page number of the request for products
 * @param {number} pageSize - The size of page
 * @returns {Promise<productsResponse>} returns the total product count and entities
 */
function getProducts(page = 1, pageSize = 10, searchQuery = '') {
  return new Promise<getProductsResponse>((resolve, reject) => {
    try {
      let products: Realm.Results<Realm.Object>;
      if (searchQuery.trim()) {
        let query = 'model CONTAINS[c] $0 || manufacturer CONTAINS[c] $0';
        products = app
          .objects(Schemas.ProductSchema.name)
          .filtered(query, searchQuery);
      } else {
        products = app.objects(Schemas.ProductSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = products.length;
      let result = products.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        // try {
        //   newObj.price = helperFuncs.transformToCurrencyString(newObj.price);
        // } catch (e) {}
        objArr.push(newObj);
      });
      console.log(objArr);

      let response = { totalCount: totalCount, entities: objArr };

      resolve(response);
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Get products for sale
 * @async
 * @function getProductsForSale
 * @param {number} [page=1] - The page number of the request for products
 * @param {number} pageSize - The size of page
 * @returns {Promise<productsResponse>} returns the total product count and entities
 */
function getProductsForSale(
  page = 1,
  pageSize = 10,
  searchQuery = '',
  type = ''
) {
  return new Promise<getProductsResponse>((resolve, reject) => {
    try {
      let products: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && cus_type == $1';
        products = app
          .objects(Schemas.ProductSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        products = app
          .objects(Schemas.ProductSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'cus_type == $0';
        products = app
          .objects(Schemas.ProductSchema.name)
          .filtered(query, type);
      } else {
        products = app.objects(Schemas.ProductSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = products.length;
      let result = products.slice(partition.pageStart, partition.pageEnd);

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

/**
 * @description Remove product by id
 * @async
 * @function removeProduct
 * @param  {string} productId - The ID(identity) of the product
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeProduct(productId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(productId);
      app.write(() => {
        let product = app.objectForPrimaryKey(
          Schemas.ProductSchema.name,
          changeToObjectId as ObjectId
        );
        app.delete(product);
        resolve(true);
      });
    } catch (e) {
      console.log(e);
      reject(e.message);
    }
  });
}

/**
 * @description Remove product by id
 * @async
 * @function removeProducts
 * @param  {string[]} productIds - The IDs(identities) of the products
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeProducts(productIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: ObjectId[] = [];

      productIds.forEach((id) => {
        changeToObjectIds.push(mongoose.Types.ObjectId(id) as ObjectId);
      });

      app.write(() => {
        changeToObjectIds.forEach((id) => {
          let product = app.objectForPrimaryKey(Schemas.ProductSchema.name, id);
          app.delete(product);
        });

        resolve(true);
      });
    } catch (e) {
      console.log(e);
      reject(e.message);
    }
  });
}

/**
 * @description Update Product information
 * @async
 * @function updateProduct
 * @param  {...Product} product - the properties to be updated
 * @returns {Promise<Product>} returns the updated product Object
 */
function updateProduct(productForEdit: ProductProperties) {
  let product = Object.assign({}, productForEdit);
  product._id = mongoose.Types.ObjectId(product._id);
  return new Promise<ProductProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let productUpdate = app.create(
          Schemas.ProductSchema.name,
          product,
          Realm.UpdateMode.Modified
        );
        let productObject: ProductProperties = productUpdate.toJSON();
        productObject._id = productObject._id.toHexString();
        resolve(productObject);
      } catch (e) {
        reject(e.message);
      }
    });
  });
}

export default {
  createProduct,
  getProductSync,
  getProduct,
  getProducts,
  getProductsForSale,
  removeProduct,
  removeProducts,
  updateProduct,
};
