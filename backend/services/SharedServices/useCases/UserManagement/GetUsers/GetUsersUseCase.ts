import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';

export class GetUsersUseCase {
  constructor(
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute() {
    try {
      this.loggerProvider.info('Request received to get users')
      const response = await this.identityProvider.listUsers()

      this.loggerProvider.info(response)
      this.loggerProvider.info('Request completed to get users')

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