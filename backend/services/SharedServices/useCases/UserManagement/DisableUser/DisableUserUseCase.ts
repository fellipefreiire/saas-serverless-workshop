import { IDisableUserRequestDTO } from './DisableUserDTO';

import { IIdentityProvider } from '/opt/nodejs/providers/interfaces/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider';

export class DisableUserUseCase {
  constructor(
    private identityProvider: IIdentityProvider,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute({ userName }: IDisableUserRequestDTO, userPoolId: string) {
    try {
      this.loggerProvider.info('Request received to disable user')
      await this.identityProvider.adminDisableUser(userName, userPoolId)

      this.loggerProvider.info('Request completed to disable user')

      return this.utilsProvider.createSuccessResponse('User disabled')
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