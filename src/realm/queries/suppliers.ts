import RealmApp from "../dbConfig/config";
import * as mongoose from "mongoose";
import Schemas from "../schemas/index";
import { SupplierProperties } from "../../types/supplier";
import helperFuncs from "../utils/helpers.func";
import Realm from "realm";

const app = RealmApp();

type getSuppliersResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Supplier
 * @property {string} supplier_name - The supplier name
 * @property {string} address - The supplier address
 * @property {string} phone - The supplier phone number
 */

/**
 *
 * @typedef {Object} suppliersResponse
 * @property {number} totalCount - total amount of suppliers
 * @property {Array}  entities - the list of paginated suppliers
 */

/**
 * @description Creating a new supplier for the current organization
 * @async
 * @function createSupplier
 * @param {Supplier} - Supplier to be created
 * @returns {Promise<Supplier>} The created supplier
 */

function createSupplier(supplier: SupplierProperties) {
  return new Promise<SupplierProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();

    supplier._id = id;

    app.write(() => {
      try {
        let newSupplier: Realm.Object;
        newSupplier = app.create(Schemas.SupplierSchema.name, supplier);
        newSupplier = newSupplier.toJSON();
        let supplierObject: SupplierProperties = newSupplier as any;
        supplierObject._id = supplierObject._id.toHexString();
        resolve(supplierObject);
      } catch (e) {
        reject(e.message);
      }
    });
  });
}

/**
 * @description Get supplier by id
 * @async
 * @function getSupplierSync
 * @param  {string} supplierId - The ID(identity) of the supplier
 * @returns {Promise<Supplier>} Returns the supplier
 */

function getSupplierSync(supplierId: string) {
  try {
    let convertIdToObjectId = mongoose.Types.ObjectId(supplierId);

    let supplier = app.objectForPrimaryKey(
      Schemas.SupplierSchema.name,
      convertIdToObjectId as ObjectId
    );

    let supplierObject: SupplierProperties = supplier?.toJSON() as any;
    supplierObject._id = supplierObject._id.toHexString();

    return supplierObject as SupplierProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get supplier by id
 * @async
 * @function getSupplier
 * @param  {string} supplierId - The ID(identity) of the supplier
 * @returns {Promise<Supplier>} Returns the supplier
 */
function getSupplier(supplierId: string) {
  return new Promise<SupplierProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(supplierId);

      let supplier = app.objectForPrimaryKey(
        Schemas.SupplierSchema.name,
        convertIdToObjectId as ObjectId
      );
      let supplierObject: SupplierProperties = supplier?.toJSON() as any;
      supplierObject._id = supplierObject._id.toHexString();
      resolve(supplierObject);
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Get suppliers
 * @async
 * @function getSuppliers
 * @param {number} [page=1] - The page number of the request for suppliers
 * @param {number} pageSize - The size of page
 * @returns {Promise<suppliersResponse>} returns the total supplier count and entities
 */
function getSuppliers(page = 1, pageSize = 10, searchQuery = "") {
  return new Promise<getSuppliersResponse>((resolve, reject) => {
    try {
      let suppliers: Realm.Results<Realm.Object>;
      if (searchQuery.trim()) {
        let query = "supplier_name CONTAINS[c] $0 || phone_no CONTAINS[c] $0";
        suppliers = app
          .objects(Schemas.SupplierSchema.name)
          .filtered(query, searchQuery);
      } else {
        suppliers = app.objects(Schemas.SupplierSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = suppliers.length;
      let result = suppliers.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach(obj => {
        let newObj: SupplierProperties = obj.toJSON();
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
 * @description Remove supplier by id
 * @async
 * @function removeSupplier
 * @param  {string} supplierId - The ID(identity) of the supplier
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeSupplier(supplierId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(supplierId);
      app.write(() => {
        let supplier = app.objectForPrimaryKey(
          Schemas.SupplierSchema.name,
          changeToObjectId as ObjectId
        );
        app.delete(supplier);
        resolve(true);
      });
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Remove supplier by id
 * @async
 * @function removeSuppliers
 * @param  {string[]} supplierIds - The IDs(identities) of the suppliers
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeSuppliers(supplierIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: ObjectId[] = [];

      supplierIds.forEach(id => {
        changeToObjectIds.push(mongoose.Types.ObjectId(id) as ObjectId);
      });

      app.write(() => {
        changeToObjectIds.forEach(id => {
          let supplier = app.objectForPrimaryKey(
            Schemas.SupplierSchema.name,
            id
          );
          app.delete(supplier);
        });

        resolve(true);
      });
    } catch (e) {
      reject(e.message);
    }
  });
}

/**
 * @description Update Supplier information
 * @async
 * @function updateSupplier
 * @param  {...Supplier} supplier - the properties to be updated
 * @returns {Promise<Supplier>} returns the updated supplier Object
 */
function updateSupplier(supplierForEdit: SupplierProperties) {
  let supplier = Object.assign({}, supplierForEdit);
  supplier._id = mongoose.Types.ObjectId(supplier._id);
  return new Promise<SupplierProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let supplierUpdate = app.create(
          Schemas.SupplierSchema.name,
          supplier,
          Realm.UpdateMode.Modified
        );
        let supplierObject: SupplierProperties = supplierUpdate.toJSON();
        supplierObject._id = supplierObject._id.toHexString();
        resolve(supplierObject);
      } catch (e) {
        reject(e.message);
      }
    });
  });
}

export default {
  createSupplier,
  getSupplier,
  getSuppliers,
  removeSupplier,
  removeSuppliers,
  updateSupplier,
  getSupplierSync
};
