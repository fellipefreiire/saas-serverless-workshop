import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { IDisableUsersByTenantRequestDTO } from './DisableUsersByTenantDTO';
import { IUsersRepository } from '/opt/nodejs/repositories/IUsersRepository';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class DisableUsersByTenantUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(data: IDisableUsersByTenantRequestDTO) {
    try {
      this.loggerProvider.info('Request received to disable users by tenant')
      const tenantId = data.tenantId

      const queryResponse = await this.usersRepository
        .findUsersByTenantId(tenantId)

      let response

      for (const user of queryResponse!) {
        response = await this.identityProvider.adminDisableUser(user.userName!)
      }

      this.loggerProvider.info(response)
      this.loggerProvider.info('Request completed to disable users')

      return this.utilsProvider.createSuccessResponse('Users disabled')
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