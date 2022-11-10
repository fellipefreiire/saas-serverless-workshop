import { APIGatewayProxyResult } from 'aws-lambda';

import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';
import { ITenantsRepository } from '/opt/nodejs/repositories/ITenantsRepository';

export class GetTenantsUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute()
    : Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to get tenants')

      const getTenantsResponse = await this.tenantsRepository.findAllTenants()

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