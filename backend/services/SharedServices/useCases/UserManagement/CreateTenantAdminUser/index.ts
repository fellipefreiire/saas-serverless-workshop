import { CreateTenantAdminUserUseCase } from './CreateTenantAdminUserUseCase';

import { DynamoDBUsersRepository } from '/opt/nodejs/repositories/implementations/AWS/DynamoDBUsersRepository';

import { AWSCognitoIdentityProvider } from '/opt/nodejs/providers/implementations/AWS/CognitoIdentityProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';

const dynamoDbUsersRepository = new DynamoDBUsersRepository()

const cognitoIdentityProvider = new AWSCognitoIdentityProvider()
const loggerProvider = new AWSLoggerProvider()
const utilsProvider = new AWSUtilsProvider()

const createTenantAdminUserUseCase = new CreateTenantAdminUserUseCase(
  dynamoDbUsersRepository,
  cognitoIdentityProvider,
  loggerProvider,
  utilsProvider
)

export { createTenantAdminUserUseCase }