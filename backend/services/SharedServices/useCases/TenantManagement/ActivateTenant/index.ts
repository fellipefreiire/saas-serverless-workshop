import { ActivateTenantUseCase } from './ActivateTenantUseCase';
import { DynamoDBTenantsRepository } from '/opt/nodejs/repositories/implementations/AWS/DynamoDBTenantsRepository';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

const dynamoDbTenantRepository = new DynamoDBTenantsRepository(tableTenantDetails!)
const utilsProvider = new AWSUtilsProvider()
const loggerProvider = new AWSLoggerProvider()

const activateTenantUseCase = new ActivateTenantUseCase(
  dynamoDbTenantRepository,
  utilsProvider,
  loggerProvider,
)

export { activateTenantUseCase }