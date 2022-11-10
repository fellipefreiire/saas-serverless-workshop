import { UpdateTenantUseCase } from './UpdateTenantUseCase'

import { DynamoDBTenantsRepository } from '/opt/nodejs/repositories/implementations/AWS/DynamoDBTenantsRepository'

import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider'
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider'

const dynamoDbTenantRepository = new DynamoDBTenantsRepository()

const loggerProvider = new AWSLoggerProvider()
const utilsProvider = new AWSUtilsProvider()

const updateTenantUseCase = new UpdateTenantUseCase(
  dynamoDbTenantRepository,
  loggerProvider,
  utilsProvider
)

export { updateTenantUseCase }