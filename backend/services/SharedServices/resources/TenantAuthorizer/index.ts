import { TenantAuthorizerUseCase } from './TenantAuthorizerUseCase';

import { AWSAuthPolicyProvider } from '/opt/nodejs/providers/implementations/AWS/AuthPolicyProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';
import { HttpVerbProvider } from '/opt/nodejs/providers/implementations/common/HttpVerbProvider';

const httpVerbProvider = new HttpVerbProvider()
const authPolicyProvider = new AWSAuthPolicyProvider(httpVerbProvider)
const loggerProvider = new AWSLoggerProvider()

const tenantAuthorizerUseCase = new TenantAuthorizerUseCase(
  authPolicyProvider,
  loggerProvider,
)

export { tenantAuthorizerUseCase }