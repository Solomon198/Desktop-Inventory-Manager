import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { RoleProperties } from '../../types/role';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';

const app = RealmApp();

type getRolesResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Role
 * @property {string} role_name - The name of the role
 * @property {string} date - The role creation date
 */

/**
 *
 * @typedef {Object} rolesResponse
 * @property {number} totalCount - total amount of roles
 * @property {Array}  entities - the list of paginated roles
 */

/**
 * @description Creating a new role for the current organization
 * @async
 * @function createRole
 * @param {Role} - Role to be created
 * @returns {Promise<Role>} The created role
 */

function createRole(role: RoleProperties) {
  return new Promise<RoleProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();

    role._id = id;

    app.write(() => {
      try {
        let newRole: Realm.Object;
        newRole = app.create(Schemas.RoleSchema.name, role);
        newRole = newRole.toJSON();
        let roleObject: RoleProperties = newRole as any;
        roleObject._id = roleObject._id.toHexString();
        roleObject.date = helperFuncs.transformDateObjectToString(
          roleObject.date
        );
        resolve(roleObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

/**
 * @description Get role by id
 * @async
 * @function getRole
 * @param  {string} roleId - The ID(identity) of the role
 * @returns {Promise<Role>} Returns the role
 */

function getRoleSync(roleId: string) {
  try {
    let convertIdToObjectId = mongoose.Types.ObjectId(roleId);

    let role = app.objectForPrimaryKey(
      Schemas.RoleSchema.name,
      convertIdToObjectId as any
    );

    let roleObject: RoleProperties = role?.toJSON() as any;
    roleObject._id = roleObject._id.toHexString();
    roleObject.date = helperFuncs.transformDateObjectToString(roleObject.date);

    return roleObject as RoleProperties;
  } catch (e) {
    return e;
  }
}

/**
 * @description Get role by id
 * @async
 * @function getRole
 * @param  {string} roleId - The ID(identity) of the role
 * @returns {Promise<Role>} Returns the role
 */
function getRole(roleId: string) {
  return new Promise<RoleProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(roleId);

      let role = app.objectForPrimaryKey(
        Schemas.RoleSchema.name,
        convertIdToObjectId as any
      );
      let roleObject: RoleProperties = role?.toJSON() as any;
      roleObject._id = roleObject._id.toHexString();
      // roleObject.date = helperFuncs.transformDateObjectToString(
      //   roleObject.date
      // );
      resolve(roleObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get roles
 * @async
 * @function getRoles
 * @param {number} [page=1] - The page number of the request for roles
 * @param {number} pageSize - The size of page
 * @returns {Promise<rolesResponse>} returns the total role count and entities
 */
function getRoles(page = 1, pageSize = 10, searchQuery = '') {
  return new Promise<getRolesResponse>((resolve, reject) => {
    try {
      let roles: Realm.Results<Realm.Object>;
      if (searchQuery.trim()) {
        let query = 'role_name CONTAINS[c] $0';
        roles = app
          .objects(Schemas.RoleSchema.name)
          .filtered(query, searchQuery)
          .sorted('date');
      } else {
        roles = app.objects(Schemas.RoleSchema.name).sorted('date');
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = roles.length;
      let result = roles.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj: RoleProperties = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        newObj.date = helperFuncs.transformDateObjectToString(newObj.date);

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
 * @description Remove role by id
 * @async
 * @function removeRole
 * @param  {string} roleId - The ID(identity) of the role
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeRole(roleId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(roleId);
      app.write(() => {
        let role = app.objectForPrimaryKey(
          Schemas.RoleSchema.name,
          changeToObjectId as any
        );
        app.delete(role);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Remove role by id
 * @async
 * @function removeRoles
 * @param  {string[]} roleIds - The IDs(identities) of the roles
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeRoles(roleIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      roleIds.forEach((id) => {
        changeToObjectIds.push(mongoose.Types.ObjectId(id));
      });

      app.write(() => {
        changeToObjectIds.forEach((id) => {
          let role = app.objectForPrimaryKey(
            Schemas.RoleSchema.name,
            id as any
          );
          app.delete(role);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Update Role information
 * @async
 * @function updateRole
 * @param  {...Role} role - the properties to be updated
 * @returns {Promise<Role>} returns the updated role Object
 */
function updateRole(roleForEdit: RoleProperties) {
  let role = Object.assign({}, roleForEdit);
  role._id = mongoose.Types.ObjectId(role._id);
  return new Promise<RoleProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let roleUpdate = app.create(
          Schemas.RoleSchema.name,
          role,
          Realm.UpdateMode.Modified
        );
        let roleObject: RoleProperties = roleUpdate.toJSON();
        roleObject._id = roleObject._id.toHexString();
        roleObject.date = helperFuncs.transformDateObjectToString(
          roleObject.date
        );
        resolve(roleObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

export default {
  createRole,
  getRole,
  getRoles,
  removeRole,
  removeRoles,
  updateRole,
  getRoleSync,
};
