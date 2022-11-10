import { ILoggerProvider } from "../../ILoggerProvider";
import { Logger } from '@aws-lambda-powertools/logger'

export class AWSLoggerProvider implements ILoggerProvider {
  private logger: Logger

  constructor() {
    this.logger = new Logger()
  }

  info = (log_message: any): void => {
    this.logger.info(log_message)
  }

  error = (log_message: any): void => {
    this.logger.error(log_message)
  }
}