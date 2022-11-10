import axios from 'axios'

import { IRegisterTenantRequestDTO } from './RegisterTenantDTO'

import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider'
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider'

export class RegisterTenantUseCase {
  constructor(
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(
    tenantDetails: IRegisterTenantRequestDTO,
    host: string,
    stageName: string,
    createTenantAdminUserResourcePath: string,
    createTenantResourcePath: string,
    region: string
  ) {
    try {
      this.loggerProvider.info('Request received to register tenant')
      this.loggerProvider.info(tenantDetails)

      const createUserResponse = await this.__createTenantAdminUser(
        tenantDetails,
        host,
        stageName,
        createTenantAdminUserResourcePath,
        region
      )

      this.loggerProvider.info(createUserResponse)

      tenantDetails.tenantAdminUserName = createUserResponse.message.tenantAdminUserName

      const createTenantResponse = await this.__create_tenant(
        tenantDetails,
        host,
        stageName,
        createTenantResourcePath,
        region
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
    region: string
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
    path: string,
    region: string
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