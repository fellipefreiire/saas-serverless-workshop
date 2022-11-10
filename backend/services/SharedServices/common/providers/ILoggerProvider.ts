export interface ILoggerProvider {
  info(log_message: any): void
  error(log_message: any): void
}
