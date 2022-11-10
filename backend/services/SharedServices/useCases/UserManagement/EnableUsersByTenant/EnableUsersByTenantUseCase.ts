import { IEnableUsersByTenantRequestDTO } from './EnableUsersByTenantDTO';

import { IUsersRepository } from '/opt/nodejs/repositories/interfaces/IUsersRepository';

import { IIdentityProvider } from '/opt/nodejs/providers/interfaces/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider';

export class EnableUsersByTenantUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(
    data: IEnableUsersByTenantRequestDTO,
    userPoolId: string,
    tableName: string
  ) {
    try {
      this.loggerProvider.info('Request received to enable users by tenant')
      const tenantId = data.tenantId

      const users = await this.usersRepository
        .findUsersByTenantId(tenantId, tableName)

      let response

      for (const user of users!) {
        response = await this.identityProvider
          .adminEnableUser(user.userName!, userPoolId)
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