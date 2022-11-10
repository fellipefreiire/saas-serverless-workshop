import { IUtilsProvider } from './../../../common/providers/IUtilsProvider';
import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { IDisableUserRequestDTO } from './DisableUserDTO';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class DisableUserUseCase {
  constructor(
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute({ userName }: IDisableUserRequestDTO) {
    try {
      this.loggerProvider.info('Request received to disable user')
      await this.identityProvider.adminDisableUser(userName)

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