import * as mongoose from 'mongoose';

/**
 * @function transformHexStringToObjectId
 * @param {string} str - An Hex String
 * @description Convert hex string to object id
 * @returns {string} returns a string
 */

function transformHexStringToObjectId(str: any) {
  return mongoose.Types.ObjectId(str);
}

/**
 * @function transformDateStringToDateType
 * @param {string} str - A date in string type
 * @description Convert string to a date format
 * @returns {string} returns a string
 */

function transformDateStringToDateType(str: any) {
  let _dateType = str.split(' ');
  let _newDateType = `${_dateType[1]}-${_dateType[2]}-${_dateType[0]}`;
  return _newDateType;
}

export default { transformHexStringToObjectId, transformDateStringToDateType };
