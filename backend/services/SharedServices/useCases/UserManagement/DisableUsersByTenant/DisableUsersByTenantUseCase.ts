import { IDisableUsersByTenantRequestDTO } from './DisableUsersByTenantDTO';

import { IUsersRepository } from '/opt/nodejs/repositories/interfaces/IUsersRepository';

import { IIdentityProvider } from '/opt/nodejs/providers/interfaces/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider';

export class DisableUsersByTenantUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(
    data: IDisableUsersByTenantRequestDTO,
    userPoolId: string,
    tableName: string
  ) {
    try {
      this.loggerProvider.info('Request received to disable users by tenant')
      const tenantId = data.tenantId

      const queryResponse = await this.usersRepository
        .findUsersByTenantId(tenantId, tableName)

      let response

      for (const user of queryResponse!) {
        response = await this.identityProvider.adminDisableUser(user.userName!, userPoolId)
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