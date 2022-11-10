import { CognitoIdentityProvider } from '/opt/nodejs/providers/implementations/AWS/CognitoIdentityProvider';
import { GetUserUseCase } from './GetUserUseCase';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const userPoolId = process.env.TENANT_USER_POOL_ID

const cognitoIdentityProvider = new CognitoIdentityProvider(userPoolId!)
const utilsProvider = new AWSUtilsProvider()
const loggerProvider = new AWSLoggerProvider()

const getUserUseCase = new GetUserUseCase(
  cognitoIdentityProvider,
  utilsProvider,
  loggerProvider
)

export { getUserUseCase }