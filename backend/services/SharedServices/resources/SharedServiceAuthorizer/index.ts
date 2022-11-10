import { SharedServiceAuthorizerUseCase } from './SharedServiceAuthorizerUseCase';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';
import { AuthPolicyProvider } from '/opt/nodejs/providers/implementations/AWS/AuthPolicyProvider';

const loggerProvider = new AWSLoggerProvider()
const authPolicyProvider = new AuthPolicyProvider()

const sharedServiceAuthorizerUseCase = new SharedServiceAuthorizerUseCase(
  authPolicyProvider,
  loggerProvider,
)

export { sharedServiceAuthorizerUseCase }