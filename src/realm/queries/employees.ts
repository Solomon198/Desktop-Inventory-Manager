import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index';
import { EmployeeProperties } from '../../types/employee';
import helperFuncs from '../utils/helpers.func';
import Realm from 'realm';

const app = RealmApp();

type getEmployeesResponse = {
  totalCount: number;
  entities: any[];
};

/**
 * @typedef {Object} Employee
 * @property {string} title - The title of employee e.g Mr/Mrs e.t.c
 * @property {string} first_name - The employee first name
 * @property {string} last_name - The employee last name
 * @property {string} gender - The gender or sex of employee e.g male or female
 * @property {string} login - unknown
 * @property {string} email - email of the employee
 * @property {string} phone_no - phone number of the employee
 * @property {string} home_address - Home address of the employee
 * @property {string} role - Role of the employee
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

    employee._id = id;

    app.write(() => {
      try {
        let newEmployee: Realm.Object;
        newEmployee = app.create(Schemas.EmployeeSchema.name, employee);
        newEmployee = newEmployee.toJSON();
        let employeeObject: EmployeeProperties = newEmployee as any;
        employeeObject._id = employeeObject._id.toHexString();
        resolve(employeeObject);
      } catch (e) {
        reject(e.message);
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
        convertIdToObjectId as ObjectId
      );
      let employeeObject: EmployeeProperties = employee?.toJSON() as any;
      employeeObject._id = employeeObject._id.toHexString();
      resolve(employeeObject);
    } catch (e) {
      reject(e.message);
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
function getEmployees(page = 1, pageSize = 10, searchQuery = '', type = '') {
  return new Promise<getEmployeesResponse>((resolve, reject) => {
    try {
      let employees: Realm.Results<Realm.Object>;
      if (searchQuery.trim() && type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0 && role CONTAINS[c] $1';
        employees = app
          .objects(Schemas.EmployeeSchema.name)
          .filtered(query, searchQuery, type);
      } else if (searchQuery.trim() && !type.trim()) {
        let query =
          'first_name CONTAINS[c] $0 || last_name CONTAINS[c] $0 || email CONTAINS[c] $0';
        employees = app
          .objects(Schemas.EmployeeSchema.name)
          .filtered(query, searchQuery);
      } else if (!searchQuery.trim() && type.trim()) {
        let query = 'role == $0';
        employees = app
          .objects(Schemas.EmployeeSchema.name)
          .filtered(query, type);
      } else {
        employees = app.objects(Schemas.EmployeeSchema.name);
      }

      let partition = helperFuncs.getPaginationPartition(page, pageSize);
      let totalCount = employees.length;
      let result = employees.slice(partition.pageStart, partition.pageEnd);

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
          changeToObjectId as ObjectId
        );
        app.delete(employee);
        resolve(true);
      });
    } catch (e) {
      reject(e.message);
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
      let changeToObjectIds: ObjectId[] = [];

      employeeIds.forEach((id) => {
        changeToObjectIds.push(mongoose.Types.ObjectId(id) as ObjectId);
      });

      app.write(() => {
        changeToObjectIds.forEach((id) => {
          let employee = app.objectForPrimaryKey(
            Schemas.EmployeeSchema.name,
            id
          );
          app.delete(employee);
        });

        resolve(true);
      });
    } catch (e) {
      reject(e.message);
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
        resolve(employeeObject);
      } catch (e) {
        reject(e.message);
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
