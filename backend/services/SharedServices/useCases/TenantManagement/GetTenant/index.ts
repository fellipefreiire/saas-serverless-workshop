import { GetTenantUseCase } from './GetTenantUseCase';
import { DynamoDBTenantsRepository } from '/opt/nodejs/repositories/implementations/AWS/DynamoDBTenantsRepository';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

const dynamoDbTenantRepository = new DynamoDBTenantsRepository(tableTenantDetails!)
const utilsProvider = new AWSUtilsProvider()
const loggerProvider = new AWSLoggerProvider()

const getTenantUseCase = new GetTenantUseCase(
  dynamoDbTenantRepository,
  utilsProvider,
  loggerProvider,
)

export { getTenantUseCase }