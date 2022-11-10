export interface IUtilsProvider {
  statusCode: StatusCode
  createSuccessResponse(message: any): HttpResult
  generateResponse(inputObject: Record<any, any>): HttpResult
  getAuth(apiUrl: string, region: string, method: string, body?: Record<any, any>): Promise<any>
}

interface HttpResult {
  statusCode: number
  headers?: {
    [header: string]: boolean | number | string
  } | undefined
  multiValueHeaders?: {
    [header: string]: Array<boolean | number | string>
  } | undefined
  body: string
  isBase64Encoded?: boolean | undefined
}

export interface StatusCode {
  SUCCESS: number,
  UN_AUTHORIZED: number,
  NOT_FOUND: number
}
