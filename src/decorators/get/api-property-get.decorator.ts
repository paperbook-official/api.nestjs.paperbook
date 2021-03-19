/* eslint-disable @typescript-eslint/ban-types */

import { ApiQuery } from '@nestjs/swagger'

import { applyDecorators } from 'src/utils/apply-decorators'

/**
 * Decorator that sets all the get swagger properties
 */
export function ApiPropertyGet(): <TFunction extends Function, Y>(
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
      name: 'join',
      type: 'string',
      isArray: true,
      description: 'Adds relational resources.'
    }),
    ApiQuery({
      required: false,
      name: 'cache',
      type: 'integer',
      description: 'Reset cache (if was enabled).'
    })
  )
}
