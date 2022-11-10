import { APIGatewayProxyResult } from 'aws-lambda';

import { IUpdateTenantDTO } from './UpdateTenantDTO';

import { ITenantsRepository } from '/opt/nodejs/repositories/ITenantsRepository';
import { IUtilsProvider } from '/opt/nodejs/providers/IUtilsProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/ILoggerProvider';

export class UpdateTenantUseCase {
  constructor(
    private tenantsRepository: ITenantsRepository,
    private utilsProvider: IUtilsProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute({ tenantId }: IUpdateTenantDTO, tenantDetails: Record<any, any>): Promise<APIGatewayProxyResult | undefined> {
    try {
      this.loggerProvider.info('Request received to update tenants')

      await this.tenantsRepository.update(
        tenantId,
        tenantDetails
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