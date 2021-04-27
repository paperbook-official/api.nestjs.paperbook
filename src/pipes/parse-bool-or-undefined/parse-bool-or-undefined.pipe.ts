import { Injectable, PipeTransform } from '@nestjs/common'

/**
 * The app's main parse bool or undefined pipe class
 *
 * Class that transforms some string value to a boolean
 * value or undefined
 */
@Injectable()
export class ParseBoolOrUndefinedPipe implements PipeTransform {
  /**
   * Method that converts some string value to a boolean value or
   * undefined
   *
   * @param value stores the string value that will be converted
   * @returns a boolean value or undefined
   */
  public transform(value: string | undefined): boolean | undefined {
    if (value === undefined) return undefined
    return value === 'true'
  }
}
