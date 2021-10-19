import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { EmployeeProperties } from '../../types/employee';
import { RoleProperties } from '../../types/role';
import helperFuncs from '../utils/helpers.func';
import RoleAPI from './roles';
import Realm from 'realm';

const app = RealmApp();

type getEmployeesResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Employee
 * @property {string} first_name - The employee first name
 * @property {string} last_name - The employee last name
 * @property {string} gender - The gender or sex of employee e.g male or female
 * @property {string} default_password - Employee default password assigned by the super admin
 * @property {string} email - email of the employee
 * @property {string} phone_no - phone number of the employee
 * @property {string} home_address - Home address of the employee
 * @property {string} role_id - RoleID of the employee
 * @property {string} date - Employee creation date
 */

/**
 *
 * @typedef {Object} employeesResponse
 * @property {number} totalCount - total amount of employees
 * @property {Array}  entities - the list of paginated employees
 */

/**
 * @description Creating a new employee for the current organization
 * @async
 * @function createEmployee
 * @param {Employee} - Employee to be created
 * @returns {Promise<Employee>} The created employee
 */

function createEmployee(employee: EmployeeProperties) {
  return new Promise<EmployeeProperties>((resolve, reject) => {
    // since _id is primary key realm prefers an ObjectId
    let id = mongoose.Types.ObjectId();
    let roleId = mongoose.Types.ObjectId(employee.role_id);

    employee._id = id;
    employee.role_id = roleId;

    app.write(() => {
      try {
        let newEmployee: Realm.Object;
        newEmployee = app.create(Schemas.EmployeeSchema.name, employee);
        newEmployee = newEmployee.toJSON();
        let employeeObject: EmployeeProperties = newEmployee as any;
        let roleId = employeeObject.role_id.toHexString();
        let role = RoleAPI.getRoleSync(roleId) as RoleProperties;

        if (Object.keys(role).length !== 0) {
          employeeObject.role_name = role.role_name;
        } else {
          employeeObject.role_name = 'N/A';
        }

        employeeObject._id = employeeObject._id.toHexString();
        employeeObject.role_id = employeeObject.role_id.toHexString();

        try {
          employeeObject.date = helperFuncs.transformDateObjectToString(
            employeeObject.date
          );
        } catch (e) {
          console.log(e);
        }
        resolve(employeeObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

/**
 * @description Get employee by id
 * @async
 * @function getEmployee
 * @param  {string} employeeId - The ID(identity) of the employee
 * @returns {Promise<Employee>} Returns the employee
 */
function getEmployee(employeeId: string) {
  return new Promise<EmployeeProperties>((resolve, reject) => {
    try {
      let convertIdToObjectId = mongoose.Types.ObjectId(employeeId);

      let employee = app.objectForPrimaryKey(
        Schemas.EmployeeSchema.name,
        convertIdToObjectId as any
      );
      let employeeObject: EmployeeProperties = employee?.toJSON() as any;
      employeeObject._id = employeeObject._id.toHexString();
      employeeObject.role_id = employeeObject.role_id.toHexString();
      let role = RoleAPI.getRoleSync(employeeObject.role_id) as RoleProperties;

      if (Object.keys(role).length !== 0) {
        employeeObject.role_name = role.role_name;
      } else {
        employeeObject.role_name = 'N/A';
      }
      // try {
      //   employeeObject.date = helperFuncs.transformDateObjectToString(
      //     employeeObject.date
      //   );
      // } catch (e) {
      //   console.log(e);
      // }
      resolve(employeeObject);
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Get employees
 * @async
 * @function getEmployees
 * @param {number} [page=1] - The page number of the request for employees
 * @param {number} pageSize - The size of page
 * @returns {Promise<employeesResponse>} returns the total employee count and entities
 */
function getEmployees(page = 1, pageSize = 10, searchQuery = '', role = '') {
  return new Promise<getEmployeesResponse>((resolve, reject) => {
    try {
      let employees: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && role.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || gender CONTAINS[c] $0 && role_id CONTAINS[c] $1';
        employees = app
          .objects(Schemas.EmployeeSchema.name)
          .filtered(query, searchQuery, role)
          .sorted('date');
      } else if (searchQuery.trim() && !role.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || gender CONTAINS[c] $0';
        employees = app
          .objects(Schemas.EmployeeSchema.name)
          .filtered(query, searchQuery)
          .sorted('date');
      } else if (!searchQuery.trim() && role.trim()) {
        // let query = 'role_id CONTAINS[c] $0';
        let query = 'role_id == $0';
        employees = app
          .objects(Schemas.EmployeeSchema.name)
          .filtered(query, role)
          .sorted('date');
      } else {
        employees = app.objects(Schemas.EmployeeSchema.name).sorted('date');
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = employees.length;
      let result = employees.slice(partition.pageStart, partition.pageEnd);

      let objArr: any[] = [];
      //converting to array of Object
      result.forEach((obj) => {
        let newObj: EmployeeProperties = obj.toJSON();
        newObj._id = newObj._id.toHexString();
        newObj.role_id = newObj.role_id.toHexString();
        let role = RoleAPI.getRoleSync(newObj.role_id) as RoleProperties;

        if (Object.keys(role).length !== 0) {
          newObj.role_name = role.role_name;
        } else {
          newObj.role_name = 'N/A';
        }

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
 * @description Remove employee by id
 * @async
 * @function removeEmployee
 * @param  {string} employeeId - The ID(identity) of the employee
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeEmployee(employeeId: string) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectId = mongoose.Types.ObjectId(employeeId);
      app.write(() => {
        let employee = app.objectForPrimaryKey(
          Schemas.EmployeeSchema.name,
          changeToObjectId as any
        );
        app.delete(employee);
        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Remove employee by id
 * @async
 * @function removeEmployees
 * @param  {string[]} employeeIds - The IDs(identities) of the employees
 * @returns {Promise<boolean>} Returns true or false if operation is successful
 */
function removeEmployees(employeeIds: string[]) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let changeToObjectIds: mongoose.Types.ObjectId[] = [];

      employeeIds.forEach((id) => {
        changeToObjectIds.push(
          mongoose.Types.ObjectId(id) as mongoose.Types.ObjectId
        );
      });

      app.write(() => {
        changeToObjectIds.forEach((id) => {
          let employee = app.objectForPrimaryKey(
            Schemas.EmployeeSchema.name,
            id as any
          );
          app.delete(employee);
        });

        resolve(true);
      });
    } catch (e) {
      reject((e as any).message);
    }
  });
}

/**
 * @description Update Employee information
 * @async
 * @function updateEmployee
 * @param  {...Employee} employee - the properties to be updated
 * @returns {Promise<Employee>} returns the updated employee Object
 */
function updateEmployee(employeeForEdit: EmployeeProperties) {
  let employee = Object.assign({}, employeeForEdit);
  employee._id = mongoose.Types.ObjectId(employee._id);
  employee.role_id = mongoose.Types.ObjectId(employee.role_id);
  return new Promise<EmployeeProperties>((resolve, reject) => {
    app.write(() => {
      try {
        let employeeUpdate = app.create(
          Schemas.EmployeeSchema.name,
          employee,
          Realm.UpdateMode.Modified
        );
        let employeeObject: EmployeeProperties = employeeUpdate.toJSON();
        employeeObject._id = employeeObject._id.toHexString();
        employeeObject.role_id = employeeObject.role_id.toHexString();
        let role = RoleAPI.getRoleSync(
          employeeObject.role_id
        ) as RoleProperties;

        if (Object.keys(role).length !== 0) {
          employeeObject.role_name = role.role_name;
        } else {
          employeeObject.role_name = 'N/A';
        }

        try {
          employeeObject.date = helperFuncs.transformDateObjectToString(
            employeeObject.date
          );
        } catch (e) {
          console.log(e);
        }
        resolve(employeeObject);
      } catch (e) {
        reject((e as any).message);
      }
    });
  });
}

export default {
  createEmployee,
  getEmployee,
  getEmployees,
  removeEmployee,
  removeEmployees,
  updateEmployee,
};
