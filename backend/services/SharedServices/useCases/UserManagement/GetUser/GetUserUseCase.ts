import { IGetUserRequestDTO } from './GetUserDTO';

import { IIdentityProvider } from '/opt/nodejs/providers/interfaces/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider';

export class GetUserUseCase {
  constructor(
    private identityProvider: IIdentityProvider,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(data: IGetUserRequestDTO, userPoolId: string) {
    try {
      this.loggerProvider.info('Request received to get user')

      const userName = data.userName

      const response = await this.identityProvider
        .adminGetUser(userName, userPoolId)

      this.loggerProvider.info('Request completed to get user')

      return this.utilsProvider.createSuccessResponse(response)
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