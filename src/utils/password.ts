import * as bcryptjs from 'bcryptjs'

/**
 * Method that can encrypt some password
 * @param password stores the password that will be encrypted
 */
export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt()
  return await bcryptjs.hash(password, salt)
}

/**
 * Method that can compare two passwords
 * @param password stores the password that the user is passing
 * @param hashedPassword stores the hashed password in the database
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcryptjs.compare(password, hashedPassword)
}
