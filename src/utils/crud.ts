import { GetManyDefaultResponse } from '@nestjsx/crud'

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

export function some<T>(
  getManyDefaultResponse: GetManyDefaultResponse<T> | T[],
  callback: (value: T) => boolean
): boolean {
  if (isGetMany(getManyDefaultResponse)) {
    return getManyDefaultResponse.data.some(callback)
  }
  return getManyDefaultResponse.some(callback)
}

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
  if (!value || Array.isArray(value)) return false

  if (value.hasOwnProperty('data') && Array.isArray(value.data)) return true

  return false
}
