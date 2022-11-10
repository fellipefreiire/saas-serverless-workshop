import { RegisterTenantUseCase } from './RegisterTenantUseCase'

import { AWSLoggerProvider } from '/opt/nodejs/providers/implementations/AWS/LoggerProvider'
import { AWSUtilsProvider } from '/opt/nodejs/providers/implementations/AWS/UtilsProvider'

const loggerProvider = new AWSLoggerProvider()
const utilsProvider = new AWSUtilsProvider()

const registerTenantUseCase = new RegisterTenantUseCase(
  loggerProvider,
  utilsProvider
)

export { registerTenantUseCase }