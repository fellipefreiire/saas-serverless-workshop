import { AWSCognitoIdentityProvider } from '/opt/nodejs/providers/implementations/AWS/CognitoIdentityProvider';
import { DisableUserUseCase } from './DisableUserUseCase';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const cognitoIdentityProvider = new AWSCognitoIdentityProvider()
const loggerProvider = new AWSLoggerProvider()
const utilsProvider = new AWSUtilsProvider()

const disableUserUseCase = new DisableUserUseCase(
  cognitoIdentityProvider,
  loggerProvider,
  utilsProvider
)


export { disableUserUseCase }