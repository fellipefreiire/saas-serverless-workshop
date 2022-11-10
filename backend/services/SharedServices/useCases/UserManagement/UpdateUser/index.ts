import { CognitoIdentityProvider } from '/opt/nodejs/providers/implementations/AWS/CognitoIdentityProvider';
import { UpdateUserUseCase } from './UpdateUserUseCase';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const userPoolId = process.env.TENANT_USER_POOL_ID

const cognitoIdentityProvider = new CognitoIdentityProvider(userPoolId!)
const utilsProvider = new AWSUtilsProvider()
const loggerProvider = new AWSLoggerProvider()

const updateUserUseCase = new UpdateUserUseCase(
  cognitoIdentityProvider,
  utilsProvider,
  loggerProvider
)

export { updateUserUseCase }