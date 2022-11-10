import { GetUsersUseCase } from './GetUsersUseCase';

import { AWSCognitoIdentityProvider } from '/opt/nodejs/providers/implementations/AWS/CognitoIdentityProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';

const cognitoIdentityProvider = new AWSCognitoIdentityProvider()
const loggerProvider = new AWSLoggerProvider()
const utilsProvider = new AWSUtilsProvider()

const getUsersUseCase = new GetUsersUseCase(
  cognitoIdentityProvider,
  loggerProvider,
  utilsProvider
)

export { getUsersUseCase }