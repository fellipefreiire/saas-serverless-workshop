import { User } from '/opt/nodejs/entities/User';
import { IIdentityProvider } from '/opt/nodejs/providers/IIdentityProvider';
import { IUsersRepository } from '/opt/nodejs/repositories/IUsersRepository';
import { ICreateTenantAdminUserRequestDTO } from './CreateTenantAdminUserDTO';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class CreateTenantAdminUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private identityProvider: IIdentityProvider,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(tenantDetails: ICreateTenantAdminUserRequestDTO) {
    try {
      this.loggerProvider.info('Request received to create new TenantAdminUser')
      this.loggerProvider.info(tenantDetails)

      const { tenantId, tenantEmail } = tenantDetails

      const tenantUserGroupResponse = await this.identityProvider
        .createGroup(tenantId, `User group for tenant ${tenantId}`)

      const tenantAdminUserName = `tenant-admin-${tenantId}`

      await this.identityProvider.adminCreateUser(tenantAdminUserName, {
        'custom:tenantId': tenantId,
        email: tenantEmail,
        email_verified: 'true',
        'custom:userRole': 'TenantAdmin'
      })

      await this.identityProvider.adminAddUserToGroup(
        tenantAdminUserName,
        tenantUserGroupResponse.groupName
      )

      const user = new User()

      user.tenantId = tenantId
      user.userName = tenantAdminUserName

      await this.usersRepository.save(user)

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