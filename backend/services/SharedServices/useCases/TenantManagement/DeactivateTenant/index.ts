import { DeactivateTenantUseCase } from './DeactivateTenantUseCase'

import { DynamoDBTenantsRepository } from '/opt/nodejs/repositories/implementations/AWS/DynamoDBTenantsRepository'

import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider'
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider'

const dynamoDbTenantRepository = new DynamoDBTenantsRepository()

const loggerProvider = new AWSLoggerProvider()
const utilsProvider = new AWSUtilsProvider()

const deactivateTenantUseCase = new DeactivateTenantUseCase(
  dynamoDbTenantRepository,
  loggerProvider,
  utilsProvider
)

export { deactivateTenantUseCase }