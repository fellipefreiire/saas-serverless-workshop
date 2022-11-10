import { APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios'

import { IDeactivateTenantDTO } from './DeactivateTenantDTO';

import { ITenantsRepository } from '/opt/nodejs/repositories/ITenantsRepository';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class DeactivateTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute({ tenantId, disableUsersPath, host, stageName, region }: IDeactivateTenantDTO): Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to deactivate tenant')

      const dataToUpdate = {
        isActive: true
      }

      await this.tenantsRepository.update(
        tenantId,
        dataToUpdate
      )

      const disableUsersResponse = await this.__invokeDisableUsers(
        host, stageName, disableUsersPath, tenantId, region
      )

      this.loggerProvider.info(disableUsersResponse)

      this.loggerProvider.info('Request completed to deactivate tenant')
      return this.utilsProvider.createSuccessResponse('Tenant Deactivated')
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.loggerProvider.error(err.message)
        this.loggerProvider.error(err.stack)
      } else {
        this.loggerProvider.error(err)
      }
    }
  }

  private async __invokeDisableUsers(
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