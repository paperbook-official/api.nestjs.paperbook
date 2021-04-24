import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

/**
 * Decorator that validates the cpf value passed in the request body
 * @returns a function with the data needed to validated the cpf
 */
export function IsCpf(
  validationOptions?: ValidationOptions
): (object: unknown, propertyName: string) => void {
  return function(object: unknown, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfValidatorConstraint
    })
  }
}

/**
 * The app's main "is cpf" validator class
 *
 * Class that is used to validate some cpf value passed
 * in some dto using the "class-validator" logic
 */
@ValidatorConstraint()
class IsCpfValidatorConstraint implements ValidatorConstraintInterface {
  /**
   * Method that validates if the cpf passed is valid or not
   * @param value stores the cpf value
   * @returns true if the cpf is valid, otherwise false
   */
  public validate(value: string): boolean {
    value = value.replace(/[^\d]+/g, '')
    if (value == '') return false

    if (
      value.length != 11 ||
      value == '00000000000' ||
      value == '11111111111' ||
      value == '22222222222' ||
      value == '33333333333' ||
      value == '44444444444' ||
      value == '55555555555' ||
      value == '66666666666' ||
      value == '77777777777' ||
      value == '88888888888' ||
      value == '99999999999'
    ) {
      return false
    }

    // Validate the first digit
    let add = 0
    for (let i = 0; i < 9; i++) {
      add += parseInt(value.charAt(i)) * (10 - i)
    }

    let rev = 11 - (add % 11)
    if (rev == 10 || rev == 11) {
      rev = 0
    }

    if (rev != parseInt(value.charAt(9))) {
      return false
    }

    // Validates the second digit
    add = 0
    for (let i = 0; i < 10; i++) {
      add += parseInt(value.charAt(i)) * (11 - i)
    }

    rev = 11 - (add % 11)
    if (rev == 10 || rev == 11) {
      rev = 0
    }

    return rev == parseInt(value.charAt(10))
  }

  /**
   * Method that returns a default message informing which
   * error has thrown
   * @returns the error message
   */
  public defaultMessage(): string {
    return 'The cpf is not valid!'
  }
}
