import * as mongoose from "mongoose";

/**
 * @function getPaginationPartition
 * @param {number} pageNo - The current page of pagination
 * @param {number} batchSize - The total records required for a page
 * @description Get the start and end position of element given the page and batchSize
 * @returns
 */

function getPaginationPartition(pageNo: number, pageSize: number) {
  let pageStart = (pageNo - 1) * pageSize;
  let pageEnd = pageNo * pageSize;
  return { pageStart: pageStart, pageEnd: pageEnd };
}

/**
 * @function transformRealmObjectsToJsObject
 * @param {Object} obj - Array of realm objects
 * @description Convert realm iterable of realm object to array of object in javascript
 * @returns {Object} returns an Object
 */

function transformRealmObjectsToJsObject(obj: any) {
  let doc: any = {};

  Object.keys(obj).forEach((val: any) => {
    doc[val] = obj[val];
  });

  return doc;
}

/**
 * @function transformRealmStringToNumber
 * @param {string} string - A string
 * @description Convert realm string to number
 * @returns {Number} return a number
 */

function transformRealmStringToNumber(str: any) {
  return parseInt(str);
}

/**
 * @function removeSymbolFromNumber
 * @param {string} amount - A string value whose commas will be removed from
 * @description Remove commas from amount string
 * @returns {string} return a string
 */

function removeSymbolFromNumber(amount: string) {
  return amount.replace(/,/g, "");
}

/**
 * @function transformStringToUpperCase
 * @param {string} string - A string
 * @description Convert string to uppercase
 * @returns {String} return a string
 */

function transformStringToUpperCase(str: any) {
  return str.toUpperCase();
}

/**
 * @function transfromDateObjectToString
 * @param {Object} date - Date of object
 * @description Convert date object to string
 * @returns {string} returns a string of date
 */

function transformDateObjectToString(date: any) {
  let d = date;
  let day = d.getDate() + "";
  let year = d.getFullYear();
  let month = d.getMonth() + 1 + "";
  let _day = day.length == 1 ? "0" + day : day;
  let _month = month.length == 1 ? "0" + month : month;
  let newDate = `${_day}-${_month}-${year}`;

  return newDate;
}

/**
 * @function transformToCurrencyString
 * @param {Number} number - Number
 * @description Convert number to currency string
 * @returns {string} returns a currency string
 */

function transformToCurrencyString(number) {
  const formatter = new Intl.NumberFormat("en-ng", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    currencyDisplay: "symbol"
  });

  return formatter.format(number);

  // "10000".replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") # => "10,000"
  // return number.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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
  getPaginationPartition,
  transformRealmObjectsToJsObject,
  transformDateObjectToString,
  transformToCurrencyString,
  transformRealmStringToNumber,
  transformCurrencyStringToNumber,
  transformStringToUpperCase,
  removeEventListener,
  removeSymbolFromNumber
};
