import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { IEnableUsersByTenantRequestDTO } from './EnableUsersByTenantDTO';
import { IUsersRepository } from '/opt/nodejs/repositories/IUsersRepository';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class EnableUsersByTenantUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(data: IEnableUsersByTenantRequestDTO) {
    try {
      this.loggerProvider.info('Request received to enable users by tenant')
      const tenantId = data.tenantId

      const users = await this.usersRepository
        .findUsersByTenantId(tenantId)

      let response

      for (const user of users!) {
        response = await this.identityProvider.adminEnableUser(user.userName!)
      }

      this.loggerProvider.info(response)
      this.loggerProvider.info('Request completed to enable users')

      return this.utilsProvider.createSuccessResponse('Users enabled')
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