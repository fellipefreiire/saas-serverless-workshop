import { IRegisterTenantRequestDTO } from './RegisterTenantDTO';
import axios from 'axios';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

const createTenantAdminUserResourcePath = process.env.CREATE_TENANT_ADMIN_USER_RESOURCE_PATH
const createTenantResourcePath = process.env.CREATE_TENANT_RESOURCE_PATH
const region = process.env.AWS_REGION

export class RegisterTenantUseCase {
  constructor(
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(
    tenantDetails: IRegisterTenantRequestDTO,
    host: string,
    stageName: string,
  ) {
    try {
      this.loggerProvider.info('Request received to register tenant')
      this.loggerProvider.info(tenantDetails)

      const createUserResponse = await this.__createTenantAdminUser(
        tenantDetails,
        host,
        stageName,
        createTenantAdminUserResourcePath!,
      )

      this.loggerProvider.info(createUserResponse)

      tenantDetails.tenantAdminUserName = createUserResponse.message.tenantAdminUserName

      const createTenantResponse = await this.__create_tenant(
        tenantDetails,
        host,
        stageName,
        createTenantResourcePath!
      )

      this.loggerProvider.info(createTenantResponse)

      this.loggerProvider.info('Request completed to register tenant')

      const response = this.utilsProvider.createSuccessResponse('You have been registered in our system')

      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.loggerProvider.error(err.message)
        this.loggerProvider.error(err.stack)
      } else {
        this.loggerProvider.error(err)
      }
    }
  }

  private async __createTenantAdminUser(
    tenantDetails: any,
    host: string | undefined,
    stageName: string,
    path: string,
  ): Promise<any> {
    const url = `https://${host}/${stageName}${path}`

    const signedRequest = await this.utilsProvider.getAuth(url, region!, 'POST', tenantDetails)

    const response = await axios({
      ...signedRequest,
      url,
      data: JSON.stringify(tenantDetails)
    })

    return response.data
  }

  private async __create_tenant(
    tenantDetails: any,
    host: string | undefined,
    stageName: string,
    path: string
  ): Promise<any> {
    const url = `https://${host}/${stageName}${path}`

    const signedRequest = await this.utilsProvider.getAuth(url, region!, 'POST', tenantDetails)

    const response = await axios({
      ...signedRequest,
      url,
      data: JSON.stringify(tenantDetails)
    })

    return response.data
  }
}