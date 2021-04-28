import { Injectable, PipeTransform } from '@nestjs/common'
import { CrudRequest } from '@nestjsx/crud'

/**
 * The app's main remove filter pipe class
 *
 * Class that can remove some filters from the crud request
 */
@Injectable()
export class RemoveIdSearchPipe implements PipeTransform {
  /**
   * Method that removes objects with the "id" property
   *
   * @param crudRequest stores the joins, filters, etc
   * @returns the new crud request
   */
  public transform(crudRequest: CrudRequest): CrudRequest {
    crudRequest.parsed.search.$and = crudRequest.parsed.search.$and.filter(
      value => {
        return !RemoveIdSearchPipe.objectHasIdFilter(value)
      }
    )
    return crudRequest
  }

  /**
   * Method that checks if the object has the "id" property
   * @param value stores the object that will be tested
   * @returns true if the object has the "id" property, otherwise false
   */
  private static objectHasIdFilter(value: unknown): value is { id: number } {
    return !!value && value.hasOwnProperty('id')
  }
}
