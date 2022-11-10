import { ICreateTenantAdminUserRequestDTO } from './CreateTenantAdminUserDTO';

import { User } from '/opt/nodejs/entities/User';

import { IUsersRepository } from '/opt/nodejs/repositories/interfaces/IUsersRepository';

import { IIdentityProvider } from '/opt/nodejs/providers/interfaces/IIdentityProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider';

export class CreateTenantAdminUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(
    tenantDetails: ICreateTenantAdminUserRequestDTO,
    userPoolId: string,
    tableName: string
  ) {
    try {
      this.loggerProvider.info('Request received to create new TenantAdminUser')
      this.loggerProvider.info(tenantDetails)

      const { tenantId, tenantEmail } = tenantDetails

      const tenantUserGroupResponse = await this.identityProvider
        .createGroup(tenantId, `User group for tenant ${tenantId}`, userPoolId)

      const tenantAdminUserName = `tenant-admin-${tenantId}`

      await this.identityProvider.adminCreateUser(tenantAdminUserName, {
        'custom:tenantId': tenantId,
        email: tenantEmail,
        email_verified: 'true',
        'custom:userRole': 'TenantAdmin'
      }, userPoolId)

      await this.identityProvider.adminAddUserToGroup(
        tenantAdminUserName,
        tenantUserGroupResponse.groupName,
        userPoolId
      )

      const user = new User()

      user.tenantId = tenantId
      user.userName = tenantAdminUserName

      await this.usersRepository.save(user, tableName)

      this.loggerProvider.info('Request completed to create new TenantAdminUser')

      return this.utilsProvider.createSuccessResponse(user)
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