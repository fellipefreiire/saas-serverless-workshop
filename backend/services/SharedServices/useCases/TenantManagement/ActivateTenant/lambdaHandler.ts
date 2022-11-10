import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { activateTenantUseCase } from '.'

const region = process.env.AWS_REGION
const enableUsersPath = process.env.ENABLE_USERS_BY_TENANT
const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  const stageName = event.requestContext.stage
  const host = event.headers.Host
  const tenantId = event.pathParameters!.tenantId

  const activateTenantResponse = await activateTenantUseCase.execute({
    tenantId: tenantId!,
    enableUsersPath: enableUsersPath!,
    stageName,
    host: host!,
    region: region!
  }, tableTenantDetails!)

  return activateTenantResponse
}
