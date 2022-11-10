import { APIGatewayProxyResult } from 'aws-lambda'

import { IUpdateTenantDTO } from './UpdateTenantDTO'

import { ITenantsRepository } from '/opt/nodejs/repositories/interfaces/ITenantsRepository'

import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider'
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider'

export class UpdateTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute({ tenantId }: IUpdateTenantDTO, tenantDetails: Record<any, any>, tableName: string): Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to update tenants')

      await this.tenantsRepository.update(
        tenantId,
        tenantDetails,
        tableName
      )

      this.loggerProvider.info('Request completed to update tenants')
      return this.utilsProvider.createSuccessResponse('Tenant Updated')
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