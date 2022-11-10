import { ICreateUserRequestDTO } from './CreateUserDTO';

import { User } from '/opt/nodejs/entities/User';

import { IUsersRepository } from '/opt/nodejs/repositories/interfaces/IUsersRepository';

import { IIdentityProvider } from '/opt/nodejs/providers/interfaces/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider';

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(
    { tenantId, userName, userEmail, userRole }: ICreateUserRequestDTO, userPoolId: string,
    tableName: string
  ) {
    try {
      this.loggerProvider.info('Request received to create new user')
      const userAlreadyExists = await this.usersRepository
        .findUserByEmail(userEmail, tableName)

      if (userAlreadyExists) {
        throw new Error('User already exists.')
      }

      await this.identityProvider.adminCreateUser(userName, {
        email: userEmail,
        'custom:userRole': userRole,
        'custom:tenantId': tenantId
      }, userPoolId)
      await this.identityProvider.adminAddUserToGroup(userName, tenantId, userPoolId)

      const user = new User()

      user.tenantId = tenantId
      user.userName = userName
      user.email = userEmail
      user.userRole = userRole

      await this.usersRepository.save(user, tableName)

      this.loggerProvider.info(user)
      this.loggerProvider.info('Request completed to create new user')

      return this.utilsProvider.createSuccessResponse('New user created')
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.loggerProvider.error(err.message)
        this.loggerProvider.error(err.stack)
      } else {
        this.loggerProvider.error(err)
      }
    }
  }
}