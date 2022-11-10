import { APIGatewayProxyResult } from 'aws-lambda'

import { ICreateTenantDTO } from './CreateTenantDTO'

import { ITenantsRepository } from '/opt/nodejs/repositories/interfaces/ITenantsRepository'

import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider'
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider'


export class CreateTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(tenantDetails: ICreateTenantDTO, tableName: string): Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to create tenant')

      const tenant = {
        ...tenantDetails,
        isActive: true
      }

      await this.tenantsRepository.save(tenant, tableName)

      this.loggerProvider.info('Request completed to create tenant')

      return this.utilsProvider.createSuccessResponse('Tenant Created')
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