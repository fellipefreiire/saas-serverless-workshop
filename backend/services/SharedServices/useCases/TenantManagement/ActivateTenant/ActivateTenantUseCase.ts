import { APIGatewayProxyResult } from 'aws-lambda'
import axios from 'axios'

import { IActivateTenantDTO } from './ActivateTenantDTO'

import { ITenantsRepository } from '/opt/nodejs/repositories/interfaces/ITenantsRepository'

import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider'
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider'

export class ActivateTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute({ tenantId, enableUsersPath, host, stageName, region }: IActivateTenantDTO, tableName: string): Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to activate tenant')

      const dataToUpdate = {
        isActive: true
      }

      await this.tenantsRepository.update(
        tenantId,
        dataToUpdate,
        tableName
      )

      const enableUsersResponse = await this.__invokeEnableUsers(
        host, stageName, enableUsersPath, tenantId, region
      )

      this.loggerProvider.info(enableUsersResponse)

      this.loggerProvider.info('Request completed to activate tenant')
      return this.utilsProvider.createSuccessResponse('Tenant Activated')
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.loggerProvider.error(err.message)
        this.loggerProvider.error(err.stack)
      } else {
        this.loggerProvider.error(err)
      }
    }
  }

  private async __invokeEnableUsers(
    host: string,
    stageName: string,
    invokePath: string,
    tenantId: string,
    region: string
  ): Promise<string> {
    const url = `https://${host}/${stageName}${invokePath}/${tenantId}`

    const signedRequest = await this.utilsProvider.getAuth(host, region, 'PUT')

    const response = await axios({
      ...signedRequest,
      url,
    })

    this.loggerProvider.info(response.status)

    if (response.status !== this.utilsProvider.statusCode.SUCCESS)
      throw new Error('Error ocurred while enabling users for the tenant')

    return 'Success invoking enable users'
  }
}