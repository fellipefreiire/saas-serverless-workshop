import { CognitoIdentityProvider } from '/opt/nodejs/providers/implementations/AWS/CognitoIdentityProvider';
import { EnableUsersByTenantUseCase } from './EnableUsersByTenantUseCase';
import { DynamoDBUsersRepository } from '/opt/nodejs/repositories/implementations/AWS/DynamoDBUsersRepository';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const tableTenantUserMap = process.env.TABLE_TENANT_USER_MAPPING
const userPoolId = process.env.TENANT_USER_POOL_ID

const dynamoDbUsersRepository = new DynamoDBUsersRepository(tableTenantUserMap!)
const cognitoIdentityProvider = new CognitoIdentityProvider(userPoolId!)
const utilsProvider = new AWSUtilsProvider()
const loggerProvider = new AWSLoggerProvider()

const enableUsersByTenantUseCase = new EnableUsersByTenantUseCase(
  dynamoDbUsersRepository,
  cognitoIdentityProvider,
  utilsProvider,
  loggerProvider
)

export { enableUsersByTenantUseCase }