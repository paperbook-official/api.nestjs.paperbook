/* eslint-disable @typescript-eslint/ban-types */

import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

/**
 * Decorator that sets all the get many swagger properties
 */
export function ApiPropertyGetManyDefaultResponse(): <
  TFunction extends Function,
  Y
>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>
) => void {
  return applyDecorators(
    ApiQuery({
      required: false,
      name: 'fields',
      type: 'string',
      isArray: true,
      description: 'Selects resource fields.'
    }),
    ApiQuery({
      required: false,
      name: 's',
      type: 'string',
      description: 'Adds search condition.'
    }),
    ApiQuery({
      required: false,
      name: 'filter',
      type: 'string',
      isArray: true,
      description: 'Adds filter condition.'
    }),
    ApiQuery({
      required: false,
      name: 'or',
      type: 'string',
      isArray: true,
      description: 'Adds OR condition.'
    }),
    ApiQuery({
      required: false,
      name: 'sort',
      type: 'string',
      isArray: true,
      description: 'Adds sort by field.'
    }),
    ApiQuery({
      required: false,
      name: 'join',
      type: 'string',
      isArray: true,
      description: 'Adds relational resources.'
    }),
    ApiQuery({
      required: false,
      name: 'limit',
      type: 'integer',
      description: 'Limit amount of resources.'
    }),
    ApiQuery({
      required: false,
      name: 'offset',
      type: 'integer',
      description: 'Offset amount of resources.'
    }),
    ApiQuery({
      required: false,
      name: 'page',
      type: 'integer',
      description: 'Page portion of resources.'
    }),
    ApiQuery({
      required: false,
      name: 'cache',
      type: 'integer',
      description: 'Reset cache (if was enabled).'
    })
  )
}
