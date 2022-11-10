import { RegisterTenantUseCase } from './RegisterTenantUseCase';
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider';
import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider';

const utilsProvider = new AWSUtilsProvider()
const loggerProvider = new AWSLoggerProvider()

const registerTenantUseCase = new RegisterTenantUseCase(
  utilsProvider,
  loggerProvider,
)

export { registerTenantUseCase }