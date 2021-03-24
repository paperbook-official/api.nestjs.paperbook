import { ApiBody } from '@nestjs/swagger'

/**
 * Decorator that says to swagger how a file look like
 * @param fileName stores the swagger field name
 */
export const ApiFile = (fileName = 'file'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })(target, propertyKey, descriptor)
}
