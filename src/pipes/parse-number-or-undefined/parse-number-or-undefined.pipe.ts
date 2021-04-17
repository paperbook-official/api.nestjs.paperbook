import { Injectable, PipeTransform } from '@nestjs/common'

/**
 * The app's main parse number or undefined pipe class
 *
 * Class that transforms some string value to a number
 * value or undefined
 */
@Injectable()
export class ParseNumberOrUndefinedPipe implements PipeTransform {
  /**
   * Method that converts some string value toa number value or
   * undefined
   * @param value stores the string value that will be converted
   * @returns a number value or undefined
   */
  public transform(value: string): number | undefined {
    if (value === undefined) return undefined
    return Number(value)
  }
}
