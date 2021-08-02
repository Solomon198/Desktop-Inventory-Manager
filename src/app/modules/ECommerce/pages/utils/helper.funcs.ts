import * as mongoose from "mongoose";

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
  let _dateType = str.split(" ");
  let _newDateType = `${_dateType[1]}-${_dateType[2]}-${_dateType[0]}`;
  return _newDateType;
}

/**
 * @function transformCurrencyStringToNumber
 * @param {string} currencyString - The currency string to be tranformed
 * @description Convert currency string to number
 * @returns {number} returns a number
 */

function transformCurrencyStringToNumber(currencyString: string) {
  return Number(currencyString.replace(/[^0-9.-]+/g, ""));
}

export default {
  transformHexStringToObjectId,
  transformDateStringToDateType,
  transformCurrencyStringToNumber
};
