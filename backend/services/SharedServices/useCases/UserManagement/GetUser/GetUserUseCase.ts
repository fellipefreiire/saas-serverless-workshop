import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { IGetUserRequestDTO } from './GetUserDTO';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class GetUserUseCase {
  constructor(
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(data: IGetUserRequestDTO) {
    try {
      this.loggerProvider.info('Request received to get user')

      const userName = data.userName

      const response = await this.identityProvider.adminGetUser(userName)

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