import { APIGatewayProxyResult } from 'aws-lambda'

import { IGetTenantDTO } from './GetTenantDTO'

import { ITenantsRepository } from '/opt/nodejs/repositories/interfaces/ITenantsRepository'

import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider'
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider'

export class GetTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute({ tenantId }: IGetTenantDTO, tableName: string)
    : Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to get tenant details')

      const getTenantResponse = await this.tenantsRepository
        .findTenantById(tenantId, tableName)

      this.loggerProvider.info('Request completed to get tenant details')
      return this.utilsProvider.createSuccessResponse(getTenantResponse)
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