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

export default { transformHexStringToObjectId };
