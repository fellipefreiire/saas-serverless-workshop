import { IUpdateUserParamDTO, IUpdateUserRequestDTO } from './UpdateUserDTO';

import { IIdentityProvider } from '/opt/nodejs/providers/interfaces/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider';

export class UpdateUserUseCase {
  constructor(
    private identityProvider: IIdentityProvider,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute({ userName }: IUpdateUserParamDTO, { userEmail, userRole }: IUpdateUserRequestDTO, userPoolId: string) {
    try {
      this.loggerProvider.info('Request received to update user')

      await this.identityProvider.adminUpdateUser(userName, {
        email: userEmail,
        'custom:userRole': userRole
      }, userPoolId)

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