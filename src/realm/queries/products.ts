import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { ProductProperties } from "../../types/product";
import { SupplierProperties } from "../../types/supplier";
import helperFuncs from "../utils/helpers.func";
import SupplierAPI from "./suppliers";
import Realm from "realm";

const app = RealmApp();

type getProductsResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Product
 * @property {string} product_name - Product model
 * @property {string} supplier_id - The supplier ID
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
    let supplierId = mongoose.Types.ObjectId(product.supplier_id);

    product._id = id;
    product.supplier_id = supplierId;

    app.write(() => {
      try {
        let newProduct: Realm.Object;
        newProduct = app.create(Schemas.ProductSchema.name, product);
        newProduct = newProduct.toJSON();
        let productObject: ProductProperties = newProduct as any;
        let supplierId = productObject.supplier_id.toHexString();
        let supplier = SupplierAPI.getSupplierSync(
          supplierId
        ) as SupplierProperties;

        if (Object.keys(supplier).length !== 0) {
          productObject.supplier_name = supplier.supplier_name;
        } else {
          productObject.supplier_name = `N/A`;
        }

        productObject._id = productObject._id.toHexString();
        productObject.supplier_id = productObject.supplier_id.toHexString();
        try {
          productObject.date = helperFuncs.transformDateObjectToString(
            productObject.date
          );
        } catch (e) {
          console.log(e);
        }

        resolve(productObject);
      } catch (e) {
        reject(e as any);
        console.log("Created product", e);
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
      convertIdToObjectId as any
    );
    let productObject: ProductProperties = product?.toJSON() as any;
    productObject._id = productObject._id.toHexString();
    productObject.supplier_id = productObject.supplier_id.toHexString();
    // try {
    //   productObject.date = helperFuncs.transformDateObjectToString(
    //     productObject.date
    //   );
    // } catch (e) {
    //   console.log(e);
    // }

    let supplier = SupplierAPI.getSupplierSync(
      productObject.supplier_id
    ) as SupplierProperties;

    if (Object.keys(supplier).length !== 0) {
      productObject.supplier_name = supplier.supplier_name;
    } else {
      productObject.supplier_name = "N/A";
    }

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
        convertIdToObjectId as any
      );
      let productObject: ProductProperties = product?.toJSON() as any;
      productObject._id = productObject._id.toHexString();
      // try {
      //   productObject.date = helperFuncs.transformDateObjectToString(
      //     productObject.date
      //   );
      // } catch (e) {
      //   console.log(e);
      // }

      let supplier = SupplierAPI.getSupplierSync(
        productObject.supplier_id
      ) as SupplierProperties;

      if (Object.keys(supplier).length !== 0) {
        productObject.supplier_name = supplier.supplier_name;
      } else {
        productObject.supplier_name = "N/A";
      }

      resolve(productObject);
    } catch (e) {
      reject((e as any).message);
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
function getProducts(page = 1, pageSize = 10, searchQuery = "") {
  return new Promise<getProductsResponse>((resolve, reject) => {
    try {
      let products: Realm.Results<Realm.Object>;
      if (searchQuery.trim()) {
        let query = "product_name CONTAINS[c] $0";
        products = app
          .objects(Schemas.ProductSchema.name)
          .filtered(query, searchQuery)
          .sorted("date");
      } else {
        products = app.objects(Schemas.ProductSchema.name).sorted("date");
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = products.length;
      let result = products.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj: ProductProperties = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        newObj.supplier_id = newObj.supplier_id.toHexString();
        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
        } catch (e) {
          console.log(e);
        }

        let supplier = SupplierAPI.getSupplierSync(
          newObj.supplier_id
        ) as SupplierProperties;

        if (Object.keys(supplier).length !== 0) {
          newObj.supplier_name = supplier.supplier_name;
        } else {
          newObj.supplier_name = "N/A";
        }

        objArr.push(newObj);
      });

      let response = { totalCount: totalCount, entities: objArr.reverse() };
      console.log("Response", response);
      resolve(response);
    } catch (e) {
      reject((e as any).message);
      console.log("Get all products", e);
    }
  });
}

/**
 * @description Get products
 * @async
 * @function getProductsForUnitManager
 * @returns {Promise<productsResponse>} returns the total product count and entities
 */
function getProductsForUnitManager() {
  return new Promise<getProductsResponse>((resolve, reject) => {
    try {
      let products: Realm.Results<Realm.Object>;

      products = app.objects(Schemas.ProductSchema.name).sorted("date");
      let totalCount = products.length;
      let result = products.slice();

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj: ProductProperties = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        newObj.supplier_id = newObj.supplier_id.toHexString();
        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
        } catch (e) {
          console.log(e);
        }

        let supplier = SupplierAPI.getSupplierSync(
          newObj.supplier_id
        ) as SupplierProperties;

        if (Object.keys(supplier).length !== 0) {
          newObj.supplier_name = supplier.supplier_name;
        } else {
          newObj.supplier_name = "N/A";
        }

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
  searchQuery = "",
  type = ""
) {
  return new Promise<getProductsResponse>((resolve, reject) => {
    try {
      let products: Realm.Results<Realm.Object>;

      products = app.objects(Schemas.ProductSchema.name).sorted("date");

      // let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = products.length;
      let result = products.slice();

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj: ProductProperties = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        try {
          newObj.date = helperFuncs.transformDateObjectToString(newObj.date);
        } catch (e) {
          console.log(e);
        }
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
          changeToObjectId as any
        );
        app.delete(product);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
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
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      productIds.forEach(id => {
        changeToObjectIds.push(
          mongoose.Types.ObjectId(id) as mongoose.Types.ObjectId
        );
      });

      app.write(() => {
        changeToObjectIds.forEach(id => {
          let product = app.objectForPrimaryKey(
            Schemas.ProductSchema.name,
            id as any
          );
          app.delete(product);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
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
  product.supplier_id = mongoose.Types.ObjectId(product.supplier_id);
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
        productObject.supplier_id = productObject.supplier_id.toHexString();
        let supplier = SupplierAPI.getSupplierSync(
          productObject.supplier_id
        ) as SupplierProperties;

        if (Object.keys(supplier).length !== 0) {
          productObject.supplier_name = supplier.supplier_name;
        } else {
          productObject.supplier_name = "N/A";
        }
        try {
          productObject.date = helperFuncs.transformDateObjectToString(
            productObject.date
          );
        } catch (e) {
          console.log(e);
        }
        resolve(productObject);
      } catch (e) {
        reject((e as any).message);
        console.log("Updated product", e);
      }
    });
  });
}

export default {
  createProduct,
  getProductSync,
  getProduct,
  getProducts,
  getProductsForUnitManager,
  getProductsForSale,
  removeProduct,
  removeProducts,
  updateProduct
};
