import { APIGatewayProxyResult } from 'aws-lambda';

import { IGetTenantDTO } from './GetTenantDTO';

import { ITenantsRepository } from '/opt/nodejs/repositories/ITenantsRepository';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class GetTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute({ tenantId }: IGetTenantDTO)
    : Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to get tenant details')

      const getTenantResponse = await this.tenantsRepository
        .findTenantById(tenantId)

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