import { GetManyDefaultResponse } from '@nestjsx/crud'

/**
 * CPerforms the specified action for each element in an array or a
 * "GetManyDefaultResponse" class instance
 * @param getManyDefaultResponse stores an array or a "GetManyDefaultResponse"
 * class instance
 * @param callback stores an action that will be called for each element of the
 * array
 */
export function forEach<T>(
  getManyDefaultResponse: GetManyDefaultResponse<T> | T[],
  callback: (value: T) => void
): void {
  if (isGetMany(getManyDefaultResponse)) {
    getManyDefaultResponse.data.forEach(callback)
    return
  }
  getManyDefaultResponse.forEach(callback)
}

/**
 * Calls a defined callback function on each element of an array,
 * and returns an array or a "GetManyDefaultResponse" class instance
 * that contains the results
 * @param getManyDefaultResponse stores an array or a "GetManyDefaultResponse"
 * class instance
 * @param callback stores an action that will be called for each element of the
 * array
 * @returns the array or "GetManyDefaultResponse" class instance with the new data
 */
export function map<T, R>(
  getManyDefaultResponse: GetManyDefaultResponse<T> | T[],
  callback: (value: T) => R
): GetManyDefaultResponse<R> | R[] {
  if (isGetMany(getManyDefaultResponse)) {
    return {
      ...getManyDefaultResponse,
      data: getManyDefaultResponse.data.map(callback)
    }
  }
  return getManyDefaultResponse.map(callback)
}

/**
 * Returns the elements of an array or "GetManyDefaultResponse" class instance that
 * meet the condition specified in a callback function.
 * @param getManyDefaultResponse stores an array or a "GetManyDefaultResponse"
 * class instance
 * @param callback stores an action that will be called for each element of the
 * array
 * @returns all the elements that were validated
 */
export function filter<T>(
  getManyDefaultResponse: GetManyDefaultResponse<T> | T[],
  callback: (value: T) => boolean
): GetManyDefaultResponse<T> | T[] {
  if (isGetMany(getManyDefaultResponse)) {
    return {
      ...getManyDefaultResponse,
      data: getManyDefaultResponse.data.filter(callback)
    }
  }
  return getManyDefaultResponse.filter(callback)
}

/**
 * Determines whether the specified callback function returns true for any element
 * of an array or "GetManyDefaultResponse" class instance
 * @param getManyDefaultResponse stores an array or a "GetManyDefaultResponse"
 * class instance
 * @param callback stores an action that will be called for each element of the
 * array
 * @returns if any element of the array or "GetManyDefaultResponse" class instance
 */
export function some<T>(
  getManyDefaultResponse: GetManyDefaultResponse<T> | T[],
  callback: (value: T) => boolean
): boolean {
  if (isGetMany(getManyDefaultResponse)) {
    return getManyDefaultResponse.data.some(callback)
  }
  return getManyDefaultResponse.some(callback)
}

/**
 * Determines whether all the members of an array or "GetManyDefaultResponse" class
 *  instance satisfy the specified test.
 * @param getManyDefaultResponse stores an array or a "GetManyDefaultResponse"
 * class instance
 * @param callback stores an action that will be called for each element of the
 * array
 * @returns if every element of the array or a "GetManyDefaultResponse" class instance
 */
export function every<T>(
  getManyDefaultResponse: GetManyDefaultResponse<T> | T[],
  callback: (value: T) => boolean
): boolean {
  if (isGetMany(getManyDefaultResponse)) {
    return getManyDefaultResponse.data.every(callback)
  }
  return getManyDefaultResponse.every(callback)
}

/**
 * Function that validates if the object that is being passed in the "value"
 * parameter is a GetManyDefaultResponse class instance
 * @param value stores an object that will be tested
 * @returns true if "value" is a "GetManyDefaultResponse" class instance
 */
export function isGetMany<T>(
  value: GetManyDefaultResponse<T> | T[]
): value is GetManyDefaultResponse<T> {
  if (!value || Array.isArray(value)) {
    return false
  }
  return !!(value.hasOwnProperty('data') && Array.isArray(value.data))
}
