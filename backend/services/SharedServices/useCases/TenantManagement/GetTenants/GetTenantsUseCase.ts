import { APIGatewayProxyResult } from 'aws-lambda'

import { ITenantsRepository } from '/opt/nodejs/repositories/interfaces/ITenantsRepository'

import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider'
import { IUtilsProvider } from '/opt/nodejs/providers/interfaces/IUtilsProvider'

export class GetTenantsUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private loggerProvider: ILoggerProvider,
    private utilsProvider: IUtilsProvider
  ) { }
  async execute(tableName: string)
    : Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to get tenants')

      const getTenantsResponse = await this.tenantsRepository.findAllTenants(tableName)

      this.loggerProvider.info('Request completed to get tenants')
      return this.utilsProvider.createSuccessResponse(getTenantsResponse)
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