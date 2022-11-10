import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { IUpdateUserParamDTO, IUpdateUserRequestDTO } from './UpdateUserDTO';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class UpdateUserUseCase {
  constructor(
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute({ userName }: IUpdateUserParamDTO, { userEmail, userRole }: IUpdateUserRequestDTO) {
    try {
      this.loggerProvider.info('Request received to update user')

      await this.identityProvider.adminUpdateUser(userName, {
        email: userEmail,
        'custom:userRole': userRole
      })

      this.loggerProvider.info('Request completed to update user')
      return this.utilsProvider.createSuccessResponse('User updated')
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