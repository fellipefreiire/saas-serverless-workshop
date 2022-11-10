import { User } from '/opt/nodejs/entities/User';
import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { IUsersRepository } from '/opt/nodejs/repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './CreateUserDTO';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute({ tenantId, userName, userEmail, userRole }: ICreateUserRequestDTO) {
    try {
      this.loggerProvider.info('Request received to create new user')
      const userAlreadyExists = await this.usersRepository
        .findUserByEmail(userEmail)

      if (userAlreadyExists) {
        throw new Error('User already exists.')
      }

      await this.identityProvider.adminCreateUser(userName, {
        email: userEmail,
        'custom:userRole': userRole,
        'custom:tenantId': tenantId
      })
      await this.identityProvider.adminAddUserToGroup(userName, tenantId)

      const user = new User()

      user.tenantId = tenantId
      user.userName = userName
      user.email = userEmail
      user.userRole = userRole

      await this.usersRepository.save(user)

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