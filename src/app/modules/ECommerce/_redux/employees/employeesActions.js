import * as requestFromServer from "./employeesCrud";
import { employeesSlice, callTypes } from "./employeesSlice";
import Queries from "../../../../../dist/realm/queries/index";
const { actions } = employeesSlice;
const EmployeeAPI = Queries.EmployeeAPI;

export const fetchEmployees = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let employeeType = typeof type === "undefined" ? "" : type.toString();

  return EmployeeAPI.getEmployees(pageNumber, pageSize, firstName, employeeType)
    .then(employees => {
      let { totalCount, entities } = employees;
      dispatch(actions.employeesFetched({ totalCount, entities }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchEmployee = id => dispatch => {
  if (!id) {
    return dispatch(actions.employeeFetched({ employeeForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return EmployeeAPI.getEmployee(id)
    .then(employee => {
      dispatch(actions.employeeFetched({ employeeForEdit: employee }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createEmployee = employeeForCreation => dispatch => {
  console.log("Create Employee Action", employeeForCreation);
  dispatch(actions.startCall({ callType: callTypes.action }));
  return EmployeeAPI.createEmployee(employeeForCreation)
    .then(employee => {
      dispatch(actions.employeeCreated({ employee }));
      console.log("__actionResult", employee);
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      console.log("actionError", error);
    });
};

export const updateEmployee = employeeUpdates => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return EmployeeAPI.updateEmployee(employeeUpdates)
    .then(employee => {
      dispatch(actions.employeeUpdated({ employee }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmployee = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return EmployeeAPI.removeEmployee(id)
    .then(result => {
      dispatch(actions.employeeDeleted({ id }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmployees = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return EmployeeAPI.removeEmployees(ids)
    .then(() => {
      dispatch(actions.employeesDeleted({ ids }));
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
