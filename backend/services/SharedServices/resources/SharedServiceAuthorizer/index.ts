import { SharedServiceAuthorizerUseCase } from './SharedServiceAuthorizerUseCase';

import { AWSAuthManagerProvider } from '/opt/nodejs/providers/implementations/AWS/AuthManagerProvider';
import { AWSAuthPolicyProvider } from '/opt/nodejs/providers/implementations/AWS/AuthPolicyProvider';
import { HttpVerbProvider } from '/opt/nodejs/providers/implementations/common/HttpVerbProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const authManagerProvider = new AWSAuthManagerProvider
const httpVerbProvider = new HttpVerbProvider()
const authPolicyProvider = new AWSAuthPolicyProvider(httpVerbProvider)
const loggerProvider = new AWSLoggerProvider()

const sharedServiceAuthorizerUseCase = new SharedServiceAuthorizerUseCase(
  authManagerProvider,
  authPolicyProvider,
  httpVerbProvider,
  loggerProvider
)

export { sharedServiceAuthorizerUseCase }
