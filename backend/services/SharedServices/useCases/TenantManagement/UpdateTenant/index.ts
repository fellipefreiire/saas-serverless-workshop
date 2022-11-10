import { UpdateTenantUseCase } from './UpdateTenantUseCase';
import { DynamoDBTenantsRepository } from '/opt/nodejs/repositories/implementations/AWS/DynamoDBTenantsRepository';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

const dynamoDbTenantRepository = new DynamoDBTenantsRepository(tableTenantDetails!)
const utilsProvider = new AWSUtilsProvider()
const loggerProvider = new AWSLoggerProvider()

const updateTenantUseCase = new UpdateTenantUseCase(
  dynamoDbTenantRepository,
  utilsProvider,
  loggerProvider,
)

export { updateTenantUseCase }