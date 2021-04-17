import { Injectable, PipeTransform } from '@nestjs/common'
import { CrudRequest } from '@nestjsx/crud'

/**
 * The app's main reset crud filters pipe class
 *
 * Class that removes all kind of searching or filtering of some
 * crud request
 */
@Injectable()
export class ResetCrudFiltersPipe implements PipeTransform {
  /**
   * Method that removes all kind of searching or filtering of some
   * crud request
   * @param crudRequest stores the crud request that will be cleaned
   * @returns the cleaned crud request
   */
  public transform(crudRequest: CrudRequest): CrudRequest {
    crudRequest.parsed.filter = []
    crudRequest.parsed.search.$and = []
    crudRequest.parsed.search.$or = []
    return crudRequest
  }
}
