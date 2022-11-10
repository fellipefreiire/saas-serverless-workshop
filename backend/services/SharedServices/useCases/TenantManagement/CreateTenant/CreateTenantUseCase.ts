import { APIGatewayProxyResult } from 'aws-lambda';
import { ICreateTenantDTO } from './CreateTenantDTO';

import { ITenantsRepository } from '/opt/nodejs/repositories/ITenantsRepository';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class CreateTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(tenantDetails: ICreateTenantDTO): Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to create tenant')

      const tenant = {
        ...tenantDetails,
        isActive: true
      }

      await this.tenantsRepository.save(tenant)

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