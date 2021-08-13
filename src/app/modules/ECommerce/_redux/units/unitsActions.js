import * as requestFromServer from './unitsCrud';
import { unitsSlice, callTypes } from './unitsSlice';
import Queries from '../../../../../dist/realm/queries/index';
const { actions } = unitsSlice;
const UnitAPI = Queries.UnitAPI;

export const createUnit = (unitForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return UnitAPI.createUnit(unitForCreation)
    .then((unit) => {
      dispatch(actions.unitCreated({ unit }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchUnits = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  let { pageNumber, pageSize, filter } = queryParams;
  let { firstName, type } = filter;
  let customerType = typeof type === 'undefined' ? '' : type.toString();

  return UnitAPI.getUnits(pageNumber, pageSize, firstName, customerType)
    .then((units) => {
      let { totalCount, entities } = units;
      dispatch(actions.unitsFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUnitsForProduct = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  if (id == '01' || !id) {
    const totalCount = 0;
    const entities = [];
    dispatch(actions.unitsForProductFetched({ totalCount, entities }));
    return;
  }
  // let { pageNumber, pageSize, filter } = queryParams;
  // let { firstName, type } = filter;
  // let customerType = typeof type === "undefined" ? "" : type.toString();
  return UnitAPI.getUnitsForProduct(id)
    .then((units) => {
      let { totalCount, entities } = units;
      dispatch(actions.unitsForProductFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUnit = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.unitFetched({ unitForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return UnitAPI.getUnit(id)
    .then((unit) => {
      dispatch(actions.unitFetched({ unitForEdit: unit }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      console.log(error);
    });
};

export const updateUnit = (unit) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return UnitAPI.updateUnit(unit)
    .then((unit) => {
      dispatch(actions.unitUpdated({ unit }));
    })
    .catch((error) => {
      console.log(error);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
