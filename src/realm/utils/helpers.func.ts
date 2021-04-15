import * as mongoose from 'mongoose';

/**
 * @function getPaginationPartition
 * @param {number} pageNo - The current page of pagination
 * @param {number} batchSize - The total records required for a page
 * @description Get the start and end position of element given the page and batchSize
 * @returns
 */

function getPaginationPartition(pageNo: number, pageSize: number) {
  let pageStart = (pageNo - 1) * pageSize;
  let pageEnd = pageNo * pageSize - 1;
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

  console.log(doc);
  return doc;
}

export default {
  getPaginationPartition,
  transformRealmObjectsToJsObject,
};
